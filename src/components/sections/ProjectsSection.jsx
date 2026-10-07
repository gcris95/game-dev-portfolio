import { projects } from "../../assets/data/projectsList"
import Project from "../Project"
import SectionTitle from "../SectionTitle"
import SectionContainer from "../SectionContainer"
import { useState } from 'react';

const INITIAL_COUNT = 3;

export default function ProjectsSection({id, italian = true}){
    const [showAll, setShowAll] = useState(false);

    const displayedProjects = showAll ? projects : projects.slice(0, INITIAL_COUNT);
    const hasMoreProjects = projects.length > INITIAL_COUNT;

    return(
        <SectionContainer id={id} gap={8}>
            <SectionTitle title='Selected Projects'/>
    
            <div className="group/list flex flex-col">
                {displayedProjects.map((project) => (
                    <div
                        key={project.title}
                        className="first:border-t border-b border-border transition-opacity duration-300 group-hover/list:opacity-40 hover:opacity-100!"
                    >
                        <Project {...project} description={project.shortDescriptionEng} />
                    </div>
                ))}
            </div>
            <div className="flex justify-center">

            {hasMoreProjects && (
                <button
                onClick={() => setShowAll((prev) => !prev)}
                className="mt-4 self-start font-medium font-sans text-primary hover:text-accent transition-colors cursor-pointer"
                >
                {showAll ? 'Show Less' : `Show More (${projects.length - INITIAL_COUNT} more)`}
                </button>
            )}
            </div>
        </SectionContainer>
    )
}