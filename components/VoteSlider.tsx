import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";

export interface VoteSliderProps {
  setVotes: Function;
  maxVotes: number;
  assignedVotes: number;
  index: number;
}

const VoteSlider: React.FC<VoteSliderProps> = ({
  setVotes,
  maxVotes,
  assignedVotes,
  index,
}) => {

  const sliderSteps = [
    [0, "0%"],
    [maxVotes * 0.25, "25%"],
    [maxVotes * 0.5, "50%"],
    [maxVotes * 0.75, "75%"],
    [maxVotes * 1, "100%"],
  ];
  const sliderMarks = {};
  sliderSteps.forEach(function (step) {
    sliderMarks[step[0]] = {
      style: { color: "rgba(67, 56, 202)" },
      label: step[1],
    };
  });

  return (
    <>
      <span className="flex flex-row items-center justify-between mt-8">
        <p className="text-sm font-medium">POP Contribution</p>
        <p className="text-sm font-medium">{assignedVotes}</p>
      </span>
      <div className="w-full ml-1 pb-3">
        <Slider
          className="mt-2 flex-grow-0 flex-shrink-0"
          value={assignedVotes}
          onChange={(value) => setVotes(value, index)}
          min={0}
          max={maxVotes}
          step={10}
          marks={sliderMarks}
          handleStyle={{ borderColor: "rgba(67, 56, 202)" }}
          dotStyle={{
            backgroundColor: "rgba(67, 56, 202)",
            border: "rgba(67, 56, 202)",
          }}
          activeDotStyle={{
            backgroundColor: "rgba(67, 56, 202)",
            border: "rgba(67, 56, 202)",
          }}
          railStyle={{ backgroundColor: "rgba(67, 56, 202)", height: "4px" }}
          trackStyle={{ backgroundColor: "rgba(67, 56, 202)", height: "4px" }}
          /* handleStyle={{
              border: '#F29F05',
              backgroundColor: '#fff',
              height: '14px',
              width: '14px',
            }} */
        />
      </div>
    </>
  );
};
export default VoteSlider;
