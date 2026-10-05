import FadeIn from "./FadeIn";

export default function SectionTitle({number, title}){
    return(
        <FadeIn delay={0.1}>
            <h2>{title}</h2>
        </FadeIn>
    );
}