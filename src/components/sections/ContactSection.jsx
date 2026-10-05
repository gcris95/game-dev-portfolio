import SectionTitle from "../SectionTitle";
import FadeIn from "../FadeIn";
import { HugeiconsIcon } from "@hugeicons/react";
import { contacts } from "../../assets/data/contactsList";
import SectionContainer from "../SectionContainer"

export default function ContactSection({id}){
    return(
        <SectionContainer id={id} gap={8}>
            <SectionTitle number='03' title='Get in Touch'/>

            <div className="flex flex-col md:flex-row gap-6">
                    <FadeIn delay={0.2}>
                        <p className="text-muted-foreground max-w-[75%]">
                            Here you can find my pages and contact information. Feel free to reach out for collaborations, inquiries, or just 
                            to say hello! I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                        </p>
                    </FadeIn>
                    <div className="flex flex-col gap-2">
                        <FadeIn delay={0.2}>
                        {contacts.map((contact, index) => (
                                <a key={index} className="flex gap-2 items-center group whitespace-nowrap" href={contact.href}>
                                    <HugeiconsIcon icon={contact.icon} className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                                    <p className="text-muted-foreground underline group-hover:text-accent">{contact.contact}</p>
                                </a>
                        ))}
                        </FadeIn>
                    </div>                                   
            </div>            
        </SectionContainer>
    );
}