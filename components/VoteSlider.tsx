import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export interface VoteSliderProps {
  setVotes: Function;
  maxVotes: number;
  assignedVotes: number;
  beneficiaryIndex: number;
}

const VoteSlider: React.FC<VoteSliderProps> = ({
  setVotes,
  maxVotes,
  assignedVotes,
  beneficiaryIndex,
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
      style: { color: "#FA6456", marginTop:"2px"},
      label: step[1],
    };
  });

  return (
    <>
      <span className="w-full flex flex-row items-center justify-between mb-6">
        <p className="text-xl font-medium">Allocate your token</p>
        <p className="text-xl font-medium">{assignedVotes}</p>
      </span>
      <div className="w-full pb-3 px-2">
        <Slider
          className=""
          value={assignedVotes}
          onChange={(value) => setVotes(value, beneficiaryIndex)}
          min={0}
          max={maxVotes}
          step={10}
          marks={sliderMarks}
          handleStyle={{ borderColor: "#FA6456", width:"20px", height:"20px"}}
          dotStyle={{
            width:"20px",
            height:"20px",
            backgroundColor: "#EFD1CE",
            border: "3px solid #FFFFFF",
            marginBottom:"-8px",
            marginLeft:"-12px"
          }}
          activeDotStyle={{
            width:"20px",
            height:"20px",
            backgroundColor: "#FA6456",
            border: "3px solid #FFFFFF",
            marginBottom:"-9px"
          }}
          railStyle={{ backgroundColor: "#EFD1CE", height: "4px", marginTop:"3px" }}
          trackStyle={{ backgroundColor: "#FA6456", height: "4px", marginTop:"3px" }}
        />
      </div>
    </>
  );
};
export default VoteSlider;
