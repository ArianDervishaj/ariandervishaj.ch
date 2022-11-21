import React from "react";

function SkillItem({name}){
    return(
        <div className="border-2 border-stone-900 dark:border-white rounded-md overflow-hidden mx-5 w-28 mb-10">
            <div className="w-full p-4 ">
                <p className="flex flex-wrap gap-2 flex-row items-center justify-center text-xs md:text-sm dark:text-white font-semibold">
                    {name}
                </p>
            </div>
        </div>
    )
}

export default SkillItem;