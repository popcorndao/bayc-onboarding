import { BeneficiaryImage } from "./CardBody";
import VoteSlider from "./VoteSlider";

export interface Beneficiary {
  image: BeneficiaryImage;
  url:string;
  name: string;
  impactDesc: string;
  area:string;
  shortDesc:string;
}

interface BeneficiaryCardProps{
  beneficiary:Beneficiary;
  setVotes:Function;
  maxVotes:number;
  assignedVotes:number;
  index:number;
}

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
  setVotes,
  maxVotes,
  assignedVotes,
  index
}) => {
  return (
    <div className="w-104 rounded-xl shadow-xl mr-4 mt-8 pb-8" key={beneficiary.name}>
      <div className="flex-shrink-0">
        <img
          className="h-48 w-full object-cover rounded-t-xl"
          src={`/images/${beneficiary.image.image}`}
          alt={beneficiary.image.description}
        />
        <div className="px-8 pb-12 mt-4 h-128">
          <a
            className="text-2xl font-bold cursor-pointer"
            href={beneficiary.url}
            target="_blank"
          >
            {beneficiary.name}
          </a>
          <div className="mt-4">
            <p className="font-medium">Impact Area</p>
            <p className="text-base">{beneficiary.area}</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">Impact Description</p>
            <p className="text-base">
              {beneficiary.impactDesc}
            </p>
          </div>
          <div className="mt-4">
            <p className="font-medium">Why they pop</p>
            <p className="text-base">
              {beneficiary.shortDesc}
            </p>
          </div>
          <a
            className="text-blue-900 cursor-pointer mt-2"
            href={beneficiary.url}
            target="_blank"
          >
            Link
          </a>
          <div>
            <VoteSlider setVotes={setVotes} maxVotes={maxVotes} assignedVotes={assignedVotes} index={index}/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BeneficiaryCard;
