import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRight } from '@hugeicons/core-free-icons'
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react'
import FadeIn from './FadeIn.jsx'

const EASE = [0.25, 0.1, 0.25, 1]

export default function Project({ title, date, description, tags, image, href, demo='' }) {    
    const cx = useMotionValue('50%')
    const cy = useMotionValue('50%')
    const radius = useMotionValue(0)
    const clipPath = useMotionTemplate`circle(${radius}px at ${cx} ${cy})`

    function setOrigin(e) {
        const r = e.currentTarget.getBoundingClientRect()
        cx.set(`${((e.clientX - r.left) / r.width) * 100}%`)
        cy.set(`${((e.clientY - r.top) / r.height) * 100}%`)
    }

    function handleMouseEnter(e) {        
        setOrigin(e)
        animate(radius, 3000, { duration: 2, ease: EASE })
    }
    function handleMouseLeave() {        
        animate(radius, 0, { duration: 0.2, ease: [0.4, 0, 0.2, 1] })
    }

    return (
        <FadeIn
            delay={0.2}
            className="group relative overflow-hidden px-6 py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {image && (
                <img src={image} alt="" loading="lazy" decoding="async"
                     className="md:hidden w-full aspect-video object-cover rounded-2xl" />
            )}

            <span className="label relative z-10 shrink-0 text-muted-foreground">{date}</span>

            <div className="relative z-10 flex flex-col gap-4 flex-1 min-w-0">
                <h3 className="text-primary group-hover:text-accent">{title}</h3>
                <p className="text-muted-foreground md:max-w-prose lg:max-w-[70ch]">{description}</p>
                {/* {demo && (
                    <a href={demo} rel="noopener noreferrer" className="text-muted-foreground group-hover:text-accent">
                        View Demo
                    </a>
                )} */}
                <ul className="flex gap-2 flex-wrap">
                    {tags.map((tag) => (
                        <span key={tag} className="label uppercase p-1 border border-border text-muted-foreground">{tag}</span>
                    ))}
                </ul>
            </div>

            <HugeiconsIcon icon={ArrowUpRight} className="relative z-10 hidden md:block w-6 h-6 shrink-0 text-primary group-hover:text-accent">
                
            </HugeiconsIcon>

            {image && (
                <motion.div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none hidden md:block [@media(hover:none)]:hidden "
                    style={{ clipPath }}
                >
                    <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover"/>
                    <div className="absolute inset-0 bg-white/75 dark:bg-black/75"/>                  
                </motion.div>
            )}

            {href && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${title}`}
                    className="absolute inset-0 z-20 rounded-4xl"
                />
            )}
        </FadeIn>
    )
}