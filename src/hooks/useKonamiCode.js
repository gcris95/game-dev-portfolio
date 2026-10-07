import { useEffect, useRef } from 'react'

const KONAMI = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a',
]

export default function useKonamiCode(onSuccess, onProgress) {
    const position = useRef(0)
    const successRef = useRef(onSuccess)
    const progressRef = useRef(onProgress)

    // le ref tengono sempre l'ultima versione delle callback
    useEffect(() => {
        successRef.current = onSuccess
        progressRef.current = onProgress
    })

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

            if (key === KONAMI[position.current]) {                
                position.current += 1
                progressRef.current?.(position.current, KONAMI.length)

                if (position.current === KONAMI.length) {
                    position.current = 0
                    successRef.current?.()
                }
            } else if (key === KONAMI[0]) {
                position.current = 1
                progressRef.current?.(1, KONAMI.length)
            } else {
                position.current = 0
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])
}