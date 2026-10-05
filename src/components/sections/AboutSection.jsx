import SectionTitle from "../SectionTitle";
import FadeIn from "../FadeIn";
import SectionContainer from "../SectionContainer"
import portrait from "../../assets/portrait.webp"

const education = [
    { degree: 'Master of Science in Computer Science', school: 'Università degli Studi di Milano', year: 'Graduated 2025' },
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
                            I'm a computer science graduate with expertise spanning web development, parallel programming and systems design.
                            <br />
                            During my Master's degree I specialized in videogame development, deepening my knowledge in algorithms, data structures and software architecture
                            while building systems that have to be performant and interactive.
                            
                            <br /><br />
                            It also gave me the possibility to gain experience with cross-disciplinary teamwork across narrative, programming, design and art, 
                            in which I took care primarily of design, gameplay logic implementation and performance optimization.
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