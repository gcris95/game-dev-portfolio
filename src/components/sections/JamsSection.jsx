import SectionContainer from "../SectionContainer";
import SectionTitle from "../SectionTitle";
import {jams} from '../../assets/data/jamsList'
import Jam from '../Jam'

export default function JamsSection(){
    return(
        <SectionContainer>
            <SectionTitle  title='Game Jams'/>

            <div className="group/list grid md:grid-cols-3">
                {jams.map((jam) =>(
                    <a href="" key={jam.title} className="first:border-t border-b md:border-b-0 md:first:border-t-0 md:first:border-l md:border-r border-border transition-opacity duration-300 group-hover/list:opacity-40 hover:opacity-100! cursor-pointer">
                        <Jam {...jam} />
                    </a>
                ))}

            </div>
        </SectionContainer>
    )
}