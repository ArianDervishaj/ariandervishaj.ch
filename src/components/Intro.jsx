import React from "react";

function Intro(){
    return(
        
        <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
            <img src="/assets/photo.png" alt="Une photo de moi" className="w-40 mb-5 rounded-2xl border-2 border-solid border-black dark" />
            
            <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">

                Arian Dervishaj
            </h1>
            <p className="text-base md:text-xl mb-3 font-medium">Etudiant en informatique</p>
            <p className="text-sm max-w-xl mb-6 font-bold">Étudiant en classe passerelle d'informatique avec de solides connaissances en C# et en Java, je suis actuellement à la recherche d'un stage dans lequel je pourrais mettre en pratique mon savoir-faire et mon esprit collaboratif.</p>
        </div>
    )
}

export default Intro;