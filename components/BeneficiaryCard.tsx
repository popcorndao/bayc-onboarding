import { BeneficiaryImage } from "./CardBody";
import VoteSlider from "./VoteSlider";

export interface Beneficiary {
  image: BeneficiaryImage;
  url: string;
  name: string;
  impactDesc: string;
  area: string;
  shortDesc: string;
}

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  setVotes: Function;
  maxVotes: number;
  assignedVotes: number;
  beneficiaryIndex: number;
}

const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  beneficiary,
  setVotes,
  maxVotes,
  assignedVotes,
  beneficiaryIndex,
}) => {
  return (
    <div className={"card"}>
      <div>
        <a
          className="text-6xl cursor-pointer w-2/3"
          href={beneficiary.url}
          target="_blank">
          {beneficiary.name}        
        </a>
      </div>
      <div>
        <p className="text-2xl font-light">0{beneficiaryIndex + 1}/05</p>
      </div>
      <div>
        <p className="text-xl font-light tracking-wide">
          <span className="text-xl font-medium mr-1">Impact Area:</span>
          {beneficiary.area}
        </p>
      </div>
      <div>
        <p className="text-xl font-light tracking-wide">
          <span className="text-xl font-medium mr-1">Mission:</span>
          {beneficiary.impactDesc}
        </p>
      </div>
      <div className="space-y-5 h-104 mt-12">
        <p className="text-xl font-light tracking-wide">
          <span className="text-xl font-medium mr-1">Why they pop:</span>
            {beneficiary.shortDesc}
        </p>
        <p>
          <a
            className="text-blue-900 cursor-pointer text-xl"
            href={beneficiary.url}
            target="_blank">
            Visit the organization
          </a>
        </p>
      </div>
      <div className="mt-12">
        <VoteSlider
          setVotes={setVotes}
          maxVotes={maxVotes}
          assignedVotes={assignedVotes}
          beneficiaryIndex={beneficiaryIndex}/>
      </div>
    </div>
  );
};
export default BeneficiaryCard;
