import { useEffect, useRef } from 'react'

const PARTICLE_DENSITY = 10000
const MAX_PARTICLES = 500
const LINK_DISTANCE = 140
const MOUSE_RADIUS = 150
const PARTICLE_RADIUS = 1.6
const LINE_WIDTH = 1.2

function hexToRgb(hex) {
    const clean = hex.trim().replace('#', '')
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean
    const n = parseInt(full, 16)
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export default function ParticleField() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const section = canvas.parentElement
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let width, height, dpr, particles = []
        let fgRgb = '67, 67, 67'
        let accentRgb = '152, 0, 0'
        let rafId = null
        let running = !prefersReducedMotion
        const mouse = { x: -9999, y: -9999 }

        function readColors() {
            const style = getComputedStyle(document.documentElement)
            fgRgb = hexToRgb(style.getPropertyValue('--foreground') || '#2B2A27')
            accentRgb = hexToRgb(style.getPropertyValue('--accent') || '#8A1F11')
        }

        function resize() {
            const rect = section.getBoundingClientRect()
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = rect.width
            height = rect.height
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / PARTICLE_DENSITY))
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
            }))
        }

        function handlePointerMove(e) {
            const rect = section.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
        function handlePointerLeave() {
            mouse.x = -9999
            mouse.y = -9999
        }

        function step() {
            ctx.clearRect(0, 0, width, height)

            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > width) p.vx *= -1
                if (p.y < 0 || p.y > height) p.vy *= -1

                const dx = p.x - mouse.x
                const dy = p.y - mouse.y
                const dist = Math.hypot(dx, dy)
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
                    p.x += (dx / dist) * force * 1.2
                    p.y += (dy / dist) * force * 1.2
                }
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i], b = particles[j]
                    const dist = Math.hypot(a.x - b.x, a.y - b.y)
                    if (dist < LINK_DISTANCE) {
                        ctx.strokeStyle = `rgba(${fgRgb}, ${0.15 * (1 - dist / LINK_DISTANCE)})`
                        ctx.lineWidth = LINE_WIDTH
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
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

            ctx.fillStyle = `rgba(${fgRgb}, 0.5)`
            for (const p of particles) {
                ctx.beginPath()
                ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2)
                ctx.fill()
            }

            rafId = running ? requestAnimationFrame(step) : null
        }

        readColors()
        resize()
        step()

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(section)

        const themeObserver = new MutationObserver(() => {
            readColors()
            if (!running) step()
        })
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            const shouldRun = entry.isIntersecting && !prefersReducedMotion
            if (shouldRun && !running) {
                running = true
                step()
            } else if (!shouldRun) {
                running = false
            }
        })
        visibilityObserver.observe(section)

        section.addEventListener('pointermove', handlePointerMove)
        section.addEventListener('pointerleave', handlePointerLeave)

        return () => {
            running = false
            if (rafId) cancelAnimationFrame(rafId)
            resizeObserver.disconnect()
            themeObserver.disconnect()
            visibilityObserver.disconnect()
            section.removeEventListener('pointermove', handlePointerMove)
            section.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 -z-10 pointer-events-none"
        />
    )
}