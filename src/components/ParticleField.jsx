import { useEffect, useRef } from 'react'

// --- Parametri dello sfondo ---
const PARTICLE_DENSITY = 10000  // pixel² per particella (più alto = meno particelle)
const MAX_PARTICLES = 300       // tetto massimo, per non appesantire schermi enormi
const LINK_DISTANCE = 150       // distanza massima per tracciare una linea tra due particelle
const MOUSE_RADIUS = 150        // raggio d'influenza del mouse
const PARTICLE_RADIUS = 1.6     // raggio base di una particella
const LINE_WIDTH = 1.2          // spessore base delle linee
const PULSE_DURATION = 400      // durata dell'effetto pulse (ms)

// --- Parametri del gioco ---
// --- Parametri del gioco ---
const START_TIME = 15000     // tempo iniziale (ms)
const MAX_TIME = 30000       // tetto massimo della riserva di tempo (ms)
const TIME_BONUS = 700       // tempo guadagnato scoppiando una particella normale (ms)
const GOLDEN_BONUS = 2000    // tempo guadagnato con una dorata (ms)
const DRAIN_ACCEL = 0.05     // il tempo scende a velocità 1 + secondi_giocati * DRAIN_ACCEL
const SPEED_START = 1.5      // moltiplicatore di velocità iniziale delle particelle
const SPEED_ACCEL = 0.04     // aumento del moltiplicatore per ogni secondo di gioco
const SPEED_MAX = 6          // tetto della velocità, oltre diventa ingiocabile
const HIT_RADIUS = 22
const GOLDEN_CHANCE = 0.15

// Interpola due colori "r, g, b" (stringhe) e restituisce il colore intermedio.
// t = 0 → colore a, t = 1 → colore b
function mixRgb(a, b, t) {
    const [r1, g1, b1] = a.split(',').map(Number)
    const [r2, g2, b2] = b.split(',').map(Number)
    return `${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)}`
}

// Converte un colore esadecimale (#abc o #aabbcc) in una stringa "r, g, b",
// pronta da usare dentro rgba(...) con trasparenza a piacere
function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '')
    // espande la forma abbreviata: "abc" → "aabbcc"
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean
    const n = parseInt(full, 16)
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export default function ParticleField({ pulse, game = false, onExit }) {
    const canvasRef = useRef(null)

    // Stato del pulse in un ref: viene letto a ogni frame dal loop di animazione
    // e non deve provocare re-render
    const pulseRef = useRef({ start: 0, strength: 0 })

    // "Ponte" tra le props e l'effect principale: l'effect espone qui le sue funzioni
    // interne (es. setGame) così il resto del componente può chiamarle
    const controlRef = useRef(null)

    // Teniamo sempre l'ultima versione di onExit senza dover ricreare l'effect principale
    const onExitRef = useRef(onExit)
    useEffect(() => { onExitRef.current = onExit }, [onExit])

    // Ogni volta che arriva un nuovo pulse (id diverso), registra l'istante di inizio
    // e l'intensità, che cresce man mano che la sequenza del Konami code avanza
    useEffect(() => {
        if (!pulse?.id || game) return
        pulseRef.current = {
            start: performance.now(),
            strength: 0.35 + 0.65 * (pulse.progress / pulse.total),
        }
    }, [pulse])

    // ===== Effect principale: setup del canvas, loop di animazione, eventi =====
    // Gira una sola volta (dipendenze vuote). Tutto lo stato mutabile vive in variabili locali
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const section = canvas.parentElement // il canvas riempie la sezione che lo contiene
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let width, height, dpr, particles = []
        let fgRgb = '67, 67, 67'      // colore del testo/foreground (aggiornato da readColors)
        let accentRgb = '152, 0, 0'   // colore d'accento (aggiornato da readColors)
        let rafId = null              // id del requestAnimationFrame corrente
        let running = !prefersReducedMotion // se false, il loop è fermo
        const mouse = { x: -9999, y: -9999 } // fuori schermo = mouse assente

        // Stato del gioco:
        // active = gioco attivo, over = tempo scaduto, score = punti,
        // endAt = istante di fine partita, rings = animazioni "pop" in corso
        // timeLeft = riserva di tempo, elapsed = tempo giocato (guida la difficoltà),
        // last = timestamp dell'ultimo frame, per calcolare il delta
        const g = { active: false, over: false, score: 0, timeLeft: 0, elapsed: 0, last: 0, rings: [] }

        // Legge le variabili CSS del tema, così i colori seguono light/dark mode
        function readColors() {
            const style = getComputedStyle(document.documentElement)
            fgRgb = hexToRgb(style.getPropertyValue('--foreground') || '#2B2A27')
            accentRgb = hexToRgb(style.getPropertyValue('--accent') || '#8A1F11')
        }

        // Crea una particella con velocità casuale.
        // Durante il gioco alcune sono "golden": più veloci e più preziose
        function makeParticle(x = Math.random() * width, y = Math.random() * height) {
            const golden = g.active && Math.random() < GOLDEN_CHANCE
            const speed = golden ? 0.6 : 0.25
            return {
                x, y,
                vx: (Math.random() - 0.5) * speed,
                vy: (Math.random() - 0.5) * speed,
                golden,
            }
        }

        // Adatta il canvas alle dimensioni della sezione e rigenera le particelle
        function resize() {
            const rect = section.getBoundingClientRect()
            dpr = Math.min(window.devicePixelRatio || 1, 2) // limitato a 2 per le prestazioni
            width = rect.width
            height = rect.height

            // Risoluzione interna maggiorata per gli schermi retina, dimensione CSS invariata
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // da qui si disegna in pixel CSS

            // Il numero di particelle è proporzionale all'area, con un tetto massimo
            const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / PARTICLE_DENSITY))
            particles = Array.from({ length: count }, () => makeParticle())
        }

        // Azzera punteggio e timer e rigenera le particelle (con quelle dorate)
        function startGame() {
            g.score = 0
            g.over = false
            g.rings = []
            g.timeLeft = START_TIME
            g.elapsed = 0
            g.last = performance.now()
            particles = particles.map(() => makeParticle())
        }

        // Funzioni esposte all'esterno tramite controlRef
        controlRef.current = {
            // Attiva/disattiva il gioco quando cambia la prop `game`
            setGame(active) {
                g.active = active
                if (active) startGame()
                else {
                    // uscita dal gioco: ripulisce gli anelli e toglie le particelle dorate
                    g.rings = []
                    particles = particles.map(() => makeParticle())
                }
                // Se il loop era fermo (reduced motion o sezione fuori schermo), lo riavvia
                if (!running) {
                    running = true
                    step()
                }
            },
        }

        // --- Gestione degli eventi ---

        // Aggiorna la posizione del mouse relativa alla sezione
        function handlePointerMove(e) {
            const rect = section.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        // Quando il puntatore esce, sposta il mouse "fuori schermo" per disattivarne l'effetto
        function handlePointerLeave() {
            mouse.x = -9999
            mouse.y = -9999
        }

        // Click: durante il gioco prova a scoppiare la particella più vicina
        function handlePointerDown(e) {
            if (!g.active || g.over) return            

            const rect = section.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            // Cerca la particella più vicina al click, entro HIT_RADIUS
            let best = -1, bestDist = HIT_RADIUS
            for (let i = 0; i < particles.length; i++) {
                const d = Math.hypot(particles[i].x - x, particles[i].y - y)
                if (d < bestDist) { best = i; bestDist = d }
            }
            if (best === -1) return // click a vuoto

            // Punti: 3 per le dorate, 1 per le normali. Poi parte l'anello di "pop"
           const hit = particles[best]
            g.score += hit.golden ? 3 : 1
            // scoppiare dà tempo extra, entro il tetto massimo
            g.timeLeft = Math.min(MAX_TIME, g.timeLeft + (hit.golden ? GOLDEN_BONUS : TIME_BONUS))
            g.rings.push({ x: hit.x, y: hit.y, born: performance.now(), golden: hit.golden })

            // La particella scoppiata rinasce da un bordo (alto o basso),
            // così il numero totale resta costante
            particles[best] = makeParticle(Math.random() * width, Math.random() < 0.5 ? 0 : height)
        }

        // Esc chiude il gioco, delegando al componente padre
        function handleKeyDown(e) {
            // Esc per uscire dal gioco
            if (e.key === 'Escape' && g.active) 
                onExitRef.current?.()
            // Enter per riavviare a partita finita
            if(g.over && e.key === 'Enter') 
                startGame()
        }

        // Disegna l'interfaccia del gioco direttamente sul canvas
        function drawHud(speed) {
            ctx.textBaseline = 'top'
            ctx.font = '600 14px ui-monospace, monospace'

            ctx.textAlign = 'left'
            ctx.fillStyle = `rgba(${fgRgb}, 0.85)`
            ctx.fillText(`SCORE ${g.score}`, 16, 16)

            // Tempo in alto a destra; negli ultimi 5 secondi diventa del colore d'accento
            ctx.textAlign = 'right'
            ctx.fillStyle = `rgba(${g.timeLeft < 5000 && !g.over ? accentRgb : fgRgb}, 0.9)`
            ctx.fillText(`${(g.timeLeft / 1000).toFixed(1)}s`, width - 16, 16)

            // Moltiplicatore di velocità sotto il tempo
            if (!g.over) {
                ctx.font = '12px ui-monospace, monospace'
                ctx.fillStyle = `rgba(${fgRgb}, 0.45)`
                ctx.fillText(`x${speed.toFixed(1)}`, width - 16, 36)
            }

            ctx.textAlign = 'center'
            if (!g.over) {
                ctx.font = '12px ui-monospace, monospace'
                ctx.fillStyle = `rgba(${fgRgb}, 0.45)`
                ctx.fillText('Pop = +time · gold = 3 pts · Esc to exit', width / 2, height - 28)
            } else {
                ctx.textBaseline = 'middle'
                ctx.fillStyle = `rgba(${accentRgb}, 1)`
                ctx.font = '700 32px ui-monospace, monospace'
                ctx.fillText("TIME'S UP", width / 2, height / 2 - 28)
                ctx.fillStyle = `rgba(${fgRgb}, 0.9)`
                ctx.font = '600 20px ui-monospace, monospace'
                ctx.fillText(`Score: ${g.score} · ${(g.elapsed / 1000).toFixed(1)}s survived`, width / 2, height / 2 + 8)
                ctx.font = '12px ui-monospace, monospace'
                ctx.fillStyle = `rgba(${fgRgb}, 0.55)`
                ctx.fillText('Enter to play again · Esc to exit', width / 2, height / 2 + 40)
            }
        }

        // --- Loop di animazione: un frame ---
        function step() {
            const now = performance.now()
            let speed = 1 // fuori dal gioco le particelle hanno velocità normale

            if (g.active) {
                // delta dall'ultimo frame, limitato: se il loop è stato fermo
                // (sezione fuori schermo) non deve scalare di colpo tutto il tempo
                const dt = Math.min(now - g.last, 100)
                g.last = now

                if (!g.over) {
                    const secs = g.elapsed / 1000
                    g.timeLeft -= dt * (1 + secs * DRAIN_ACCEL) // il tempo scende sempre più veloce
                    g.elapsed += dt
                    if (g.timeLeft <= 0) { g.timeLeft = 0; g.over = true }
                }

                // le particelle accelerano; a partita finita tornano calme
                speed = g.over ? 1 : Math.min(SPEED_MAX, SPEED_START + (g.elapsed / 1000) * SPEED_ACCEL)
            }

            // --- Pulse del Konami code ---
            // `decay` va da 1 a 0 nel tempo (curva quadratica: parte forte e si spegne dolcemente).
            // `pulseAmt` lo scala per l'intensità. Con 0 tutto torna all'aspetto normale
            const { start, strength } = pulseRef.current
            const elapsed = now - start
            const decay = elapsed < PULSE_DURATION ? (1 - elapsed / PULSE_DURATION) ** 2 : 0
            const pulseAmt = decay * strength
            // Durante il pulse linee e particelle virano dal colore base all'accento
            const linkRgb = pulseAmt > 0 ? mixRgb(fgRgb, accentRgb, Math.min(1, pulseAmt * 1.5)) : fgRgb

            ctx.clearRect(0, 0, width, height)

            // 1) Aggiorna la posizione delle particelle
            for (const p of particles) {
                p.x += p.vx * speed
                p.y += p.vy * speed
                // Rimbalzo sui bordi: inverte la velocità
                if (p.x < 0 || p.x > width) p.vx *= -1
                if (p.y < 0 || p.y > height) p.vy *= -1

                // Repulsione dal mouse (disattivata nel gioco, dove le particelle sono bersagli).
                // La spinta è più forte quanto più la particella è vicina
                if (!g.active) {
                    const dx = p.x - mouse.x
                    const dy = p.y - mouse.y
                    const dist = Math.hypot(dx, dy)
                    if (dist < MOUSE_RADIUS && dist > 0) {
                        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
                        p.x += (dx / dist) * force * 1.2
                        p.y += (dy / dist) * force * 1.2
                    }
                }
            }

            // 2) Disegna le linee tra particelle vicine e dal mouse alle particelle
            for (let i = 0; i < particles.length; i++) {
                // Confronta ogni coppia una sola volta (j parte da i + 1)
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j]
                    const dist = Math.hypot(a.x - b.x, a.y - b.y)
                    if (dist < LINK_DISTANCE) {
                        // Più sono vicine, più la linea è visibile; il pulse la rafforza
                        const alpha = 0.15 * (1 - dist / LINK_DISTANCE) * (1 + pulseAmt * 3)
                        ctx.strokeStyle = `rgba(${linkRgb}, ${Math.min(alpha, 1)})`
                        ctx.lineWidth = LINE_WIDTH * (1 + pulseAmt)
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
                
                if(!g.active){
                    // Linea d'accento tra il mouse e le particelle nel suo raggio                
                    const dMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y)
                    if (dMouse < MOUSE_RADIUS) {
                        ctx.strokeStyle = `rgba(${accentRgb}, ${0.4 * (1 - dMouse / MOUSE_RADIUS)})`
                        ctx.lineWidth = LINE_WIDTH
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(mouse.x, mouse.y)
                        ctx.stroke()
                    }
                }
            }

            // 3) Disegna le particelle (sopra le linee).
            // Nel gioco sono più grandi, per essere più facili da colpire
            const baseRadius = (g.active ? PARTICLE_RADIUS * 1.8 : PARTICLE_RADIUS) * (1 + pulseAmt * 2.5)
            for (const p of particles) {
                ctx.beginPath()
                if (p.golden) {
                    // Particelle dorate: colore d'accento, più grandi, non toccate dal pulse
                    ctx.fillStyle = `rgba(${accentRgb}, 0.95)`
                    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2)
                } else {
                    ctx.fillStyle = `rgba(${linkRgb}, ${Math.min(0.5 + pulseAmt * 0.5, 1)})`
                    ctx.arc(p.x, p.y, baseRadius, 0, Math.PI * 2)
                }
                ctx.fill()
            }

            // 4) Anelli di "pop": si espandono e svaniscono in 450ms, poi vengono rimossi
            g.rings = g.rings.filter(r => now - r.born < 450)
            for (const r of g.rings) {
                const t = (now - r.born) / 450 // progresso 0 → 1
                ctx.strokeStyle = `rgba(${r.golden ? accentRgb : fgRgb}, ${0.7 * (1 - t)})`
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(r.x, r.y, 6 + t * 26, 0, Math.PI * 2)
                ctx.stroke()
            }

            // 5) HUD del gioco, sopra a tutto
            if (g.active) drawHud(speed)

            // Pianifica il frame successivo solo se il loop è attivo
            rafId = running ? requestAnimationFrame(step) : null
        }

        // --- Avvio ---
        readColors()
        resize()
        step()

        // Ricalcola dimensioni e particelle quando la sezione cambia misura
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(section)

        // Rilegge i colori quando cambia la classe su <html> (cambio tema).
        // Se il loop è fermo, ridisegna un frame per mostrare i nuovi colori
        const themeObserver = new MutationObserver(() => {
            readColors()
            if (!running) step()
        })
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        // Mette in pausa l'animazione quando la sezione non è visibile (risparmia CPU/batteria).
        // Con reduced motion resta ferma, a meno che il gioco non sia attivo
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            const shouldRun = entry.isIntersecting && (!prefersReducedMotion || g.active)
            if (shouldRun && !running) {
                running = true
                step()
            } else if (!shouldRun) {
                running = false
            }
        })
        visibilityObserver.observe(section)

        // Gli eventi sono sulla sezione, non sul canvas, che ha pointer-events: none
        section.addEventListener('pointermove', handlePointerMove)
        section.addEventListener('pointerleave', handlePointerLeave)
        section.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('keydown', handleKeyDown)

        // Cleanup: ferma il loop e rimuove observer e listener
        return () => {
            running = false
            if (rafId) cancelAnimationFrame(rafId)
            resizeObserver.disconnect()
            themeObserver.disconnect()
            visibilityObserver.disconnect()
            section.removeEventListener('pointermove', handlePointerMove)
            section.removeEventListener('pointerleave', handlePointerLeave)
            section.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('keydown', handleKeyDown)
            controlRef.current = null
        }
    }, [])

    // Quando cambia la prop `game`, avvisa l'effect principale.
    // Va dichiarato DOPO quello principale, così controlRef è già valorizzato
    useEffect(() => {
        controlRef.current?.setGame(game)
    }, [game])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true" // è puramente decorativo, gli screen reader lo ignorano
            className="absolute inset-0 -z-10 pointer-events-none"
        />
    )
}