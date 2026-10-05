import FadeIn from "../FadeIn"
import SectionContainer from "../SectionContainer"
import ParticleField from "../ParticleField"

export default function HeroSection(){
    return(
        <SectionContainer gap={2} className="relative overflow-hidden min-h-[60svh] justify-center">
            
            <ParticleField />

            <FadeIn delay={0.1}>
                <span className="text-accent  text-[clamp(0.8rem,2vw,0.95rem)] font-medium tracking-wider">
                    Software Engineer
                </span>
            </FadeIn>

            <FadeIn delay={0.2} className="leading-[1.04] pb-4">
                <h1>Hi! I'm Giovanni.</h1>
                <h2 className="text-muted-foreground mt-1">
                    Crafting digital experiences.
                </h2>
            </FadeIn>

            <FadeIn delay={0.25}>
                <p className="text-muted-foreground max-w-lg leading-relaxed">
                    Passionate about the art of coding, with a creative approach to problem-solving and development.
                    I blend game dev principles and software engineering 
                    to build engaging, user-centered digital products.
                </p>
            </FadeIn>

            <FadeIn delay={0.3} className="mt-2 flex gap-4">
                <a href="#works" className="px-5 py-3 bg-primary text-primary-foreground text-sm font-medium hover:opacity-75 transition-opacity">
                    View Works
                </a>
                <a href="#contacts" className="px-5 py-3 text-primary border border-border text-sm font-medium hover:bg-muted transition-colors">
                    Contact Me
                </a>
            </FadeIn>
        </SectionContainer>
    )
}