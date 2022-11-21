import React from "react";
import skills from "../data/skills";
import SkillItem from "./SkillItem";
import Title from "./Title";

function Skills(){
    return(
        <div className="w-full" >
            <div className="text-lg text-center mt-20 dark:text-white mb-10">
                <Title>Skills</Title>
            </div>
                <div className="flex flex-row justify-center">
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