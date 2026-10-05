import { projects } from "../../assets/data/projectsList"
import Project from "../Project"
import SectionTitle from "../SectionTitle"
import SectionContainer from "../SectionContainer"

export default function ProjectsSection({id, italian = true}){
    return(
        <SectionContainer id={id} gap={8}>
            <SectionTitle number='01' title='Selected Projects'/>
    
            <div className="group/list flex flex-col">
                {projects.map((project) => (
                    <div
                        key={project.title}
                        className="first:border-t border-b border-border transition-opacity duration-300 group-hover/list:opacity-40 hover:opacity-100!"
                    >
                        <Project {...project} description={project.descriptionEng} />
                    </div>
                ))}
            </div>
        </SectionContainer>
    )
}