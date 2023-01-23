import React from "react";

function Intro(){
    return(
        
        <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
            <h1 className="text-5xl md:text-7xl p-2 mb-4 md:mb-6 font-bold bg-gradient-to-br from-fuchsia-700 to-cyan-700 dark:from-fuchsia-500 dark:to-cyan-500 bg-clip-text text-transparent">

                Arian Dervishaj
            </h1>
            <p className="text-base md:text-xl mb-3 mt-2 font-medium">Etudiant en informatique</p>
            <p className="text-sm max-w-xl mb-6">
            Étudiant en informatique, je suis passionné d'informatique depuis mon plus jeune âge.
             Lors de ma formation, j'ai eu la chance de pouvoir m'initier à plusieurs langages de programmation
              différents ainsi que de développer des projets non seulement amusants mais qui me poussait à me surpasser.
               Je suis actuellement en recherche de stage afin de compléter mon année et de continuer à développer mes capacités techniques.
               
            </p>
        </div>
    )
}

export default Intro;