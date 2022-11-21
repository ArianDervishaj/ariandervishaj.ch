import React from "react";
import skills from "../data/skills";
import SkillItem from "./SkillItem";
import Title from "./Title";

function Skills(){
    return(
        
        <div className="w-full mt-20 border-2 border-black dark:border-white rounded-lg pl-5 pt-5 pb-5" >
            <div className="text-lg text-left dark:text-white">
                <Title>Compétences Techniques</Title>
            </div>
            <div className="flex flex-row flex-wrap justify-center mt-8">
                {skills.map(skill => (
                    <SkillItem
                        name={skill.name}
                    />
                ))}
            </div>
        </div>
    )
}

export default Skills;