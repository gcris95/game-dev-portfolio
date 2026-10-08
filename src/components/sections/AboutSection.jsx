import SectionTitle from "../SectionTitle";
import FadeIn from "../FadeIn";
import SectionContainer from "../SectionContainer"
import portrait from "../../assets/portrait.webp"

const education = [
    { degree: 'Master of Science in Computer Science - Game Design', school: 'Università degli Studi di Milano', year: 'Graduated 2025' },
    { degree: 'Bachelor of Science in Computer Science', school: 'Università degli Studi di Salerno', year: 'Graduated 2017' },
];

export default function AboutSection({id}){
    return(
        <SectionContainer id={id} gap={8}>
            <SectionTitle number='02' title='About'/>

            <div className="flex flex-col md:flex-row-reverse gap-6">  
                <div className="flex flex-col gap-6">
                    <FadeIn delay={0.2} className='pb-8 border-b border-border'>
                        <p className="text-muted-foreground">
                            I'm Giovanni, a game designer and programmer currently based in Italy. My passion for video games began when I was 7 with a Game Boy and Pokémon Ruby.
                            <br />
                            I started my academic journey with a Bachelor's degree in Computer Science, then I pursued a Master's degree in Computer Science at the University of Milan, 
                            initially focusing on game programming and then moving to game design aiming to work on player experience.<br />
                            During my specialization, I deepened my expertise in computer science and could study and practice game mechanics design, level design, 
                            artificial intelligente, player psychology, narrative design, gameplay programming, prototyping, and other amazing subjects.<br />
                            I've had the opportunity to work on several projects in multidisciplinary teams and, in 2020, I was part of the team that won the NGD 
                            contest with the game Disease Me.<br />
                            Today, I'm passionate about many types of games and about creating emotionally resonant experiences for players.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2} className="flex flex-col gap-6">
                        <h3 className="label uppercase text-muted-foreground">Education</h3>
                        <ul className="flex flex-col gap-8">
                            {education.map((e) => (
                                <li key={e.degree}>
                                    <p className="font-medium leading-snug text-primary">{e.degree}</p>
                                    <span className="label block pt-1 text-muted-foreground">{e.school} · {e.year}</span>
                                </li>
                            ))}
                        </ul>
                    </FadeIn>


                </div>
                <FadeIn className="w-full max-w-75 shrink-0 self-center md:self-auto" delay={0.2}>
                    <img src={portrait} alt="Portrait"/>
                </FadeIn>                                          
            </div>            
        </SectionContainer>
    );
}