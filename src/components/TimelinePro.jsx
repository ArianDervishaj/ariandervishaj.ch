import React from "react";
import timelinePro from "../data/timelinePro";
import TimelineItem from "./TimelineItem";
import Title from "./Title";

function Timeline() {
  return (
    <div className="whitespace-pre-wrap flex flex-col md:flex-row justify-center mb-5 mt-20">
      <div>
        <Title>Pro</Title>
        {timelinePro.map((item) => (
          <TimelineItem
            key = {item.title}
            year={item.year}
            title={item.title}
            duration={item.duration}
            details={item.details}
          />
        ))}
      </div>
    </div>
  );
}

export default Timeline;
