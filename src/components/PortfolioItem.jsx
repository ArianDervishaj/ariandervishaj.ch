import React from "react";

function PortfolioItem({ title, imgUrl, stack, link }) {
  return (
    <a
      className="border-2 border-stone-900 dark:border-white rounded-md overflow-hidden hover:scale-105 ease-in-out duration-300"
      href={link}
      target="_blank"
    >
      <img
        src={imgUrl}
        alt="portfolio"
        className="w-full h-36 md:h-48 object-cover cursor-pointer border-b-2 border-stone-900 dark:border-white "
      />
      <div className="w-full p-4">
        <h3 className="text-lg md:text-xl mb-2 md:mb-3 font-semibold dark:text-white">
          {title}
        </h3>
        <p className="flex flex-wrap gap-2 flex-row items-center justify-start text-xs md:text-sm dark:text-white">
          {stack.map((item) => (
            
            <span key = {item.title} className="inline-block px-2 py-1 font-semibold border-2 border-stone-900 dark:border-white rounded-md">
              {item}
            </span>
          ))}
        </p>
      </div>
    </a>
  );
}

export default PortfolioItem;
