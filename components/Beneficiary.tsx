import * as Icon from "react-feather";
import BeneficiaryCard from "./BeneficiaryCard";
import { BeneficiaryImage } from "./CardBody";

export interface Beneficiary {
  image: BeneficiaryImage;
  url: string;
  name: string;
  impactDesc: string;
  area: string;
  shortDesc: string;
}

interface BeneficiaryProps {
  beneficiary: Beneficiary;
  setVotes: Function;
  maxVotes: number;
  assignedVotes: number;
  beneficiaryIndex: number;
  setBeneficiaryIndex: Function;
}

const Beneficiary: React.FC<BeneficiaryProps> = ({
  beneficiary,
  setVotes,
  maxVotes,
  assignedVotes,
  beneficiaryIndex,
  setBeneficiaryIndex,
}) => {
  return (
    <div className={"beneficiary"}>
      <div className={"beneficiary-column"}>
        <img
            className={"beneficiary-image"}
            src={`/images/${beneficiary.image.image}`}
            alt={beneficiary.image.description}
          />
          <div className={"beneficiary-row"}>
            <button
                className="w-24 h-24 rounded-full bg-red-500 flex justify-center items-center flex-shrink-0 flex-grow-0 hover:bg-red-600"
                onClick={() =>
                  setBeneficiaryIndex(
                    beneficiaryIndex === 0 ? 4 : beneficiaryIndex - 1
                  )
                }>
              <Icon.ChevronLeft className="text-white h-18 w-18 mr-2" />
            </button>
            <button
                className="w-24 h-24 rounded-full bg-red-500 flex justify-center items-center flex-shrink-0 flex-grow-0 hover:bg-red-600"
                onClick={() =>
                  setBeneficiaryIndex(
                    beneficiaryIndex === 4 ? 0 : beneficiaryIndex + 1
                  )
                }
              >
              <Icon.ChevronRight className="text-white h-18 w-18 ml-2" />
            </button>
          </div>
      </div>
      <BeneficiaryCard
        beneficiary={beneficiary}
        setVotes={setVotes}
        maxVotes={maxVotes}
        assignedVotes={assignedVotes}
        beneficiaryIndex={beneficiaryIndex}/>
    </div>
  );
};
export default Beneficiary;
