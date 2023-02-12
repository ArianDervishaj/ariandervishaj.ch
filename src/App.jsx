import React, { useEffect, useState } from "react";
import Intro from "./components/Intro";
import Portfolio from "./components/Portfolio";
import TimelineAca from "./components/TimelineAca";
import TimelinePro from "./components/TimelinePro";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Skills from "./components/Skills";
import Fade from "react-reveal/Fade";
import { motion } from "framer-motion";

function App() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const sun = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 
        12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 
        1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );

  const moon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="white"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 
        0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 
        9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );

  return (
    <>
      <button
        type="button"
        onClick={handleThemeSwitch}
        className="fixed p-2 z-10 right-20 top-4 bg-violet-300 dark:bg-orange-300 text-lg rounded-md"
      >
        {theme === "dark" ? sun : moon}
      </button>
      <div className="bg-white dark:bg-stone-900 dark:text-stone-300 text-stone-900 min-h-screen font-inter">
        <div className=" max-w-5xl w-11/12 mx-auto">
          <Fade top distance="10%" duration={1500}>
            <Intro />
            <Portfolio />
            <Skills />
          </Fade>

          <div className="flex flex-row">
            <Fade left distance="10%" duration={1500}>
              <div className="w-1/2 mr-5">
                <TimelineAca />
              </div>
            </Fade>
            <Fade right distance="10%" duration={1500}>
              <div className="w-1/2 ml-5">
                <TimelinePro />
              </div>
            </Fade>
          </div>

          <a href="/assets/CV_2022.pdf"
          target="_blank">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="flex mx-auto text-center px-8 py-3 w-max text-base font-medium rounded-md text-white 
                          bg-gradient-to-tl from-fuchsia-500 to-cyan-500  drop-shadow-md hover:stroke-white
                          mb-20"
            >
              Télécharger mon CV en PDF

            </motion.button>
            </a>
          <Fade bottom distance="10%" duration={1500}>
            <Contact />
          </Fade>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
