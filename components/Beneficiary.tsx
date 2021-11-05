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
    <div className="w-full relative z-20">
      <div className="flex flex-row w-full">
        <div className="w-1/3 mr-4">
          <img
            className="h-104 object-cover rounded-xl"
            src={`/images/${beneficiary.image.image}`}
            alt={beneficiary.image.description}
          />
          <div className="flex flex-row justify-end w-full mt-8">
            <div className="flex flex-row items-center justify-between w-3/4 2xl:w-2/3">
              <button
                className="w-24 h-24 rounded-full bg-red-500 flex justify-center items-center hover:bg-red-600"
                onClick={() =>
                  setBeneficiaryIndex(
                    beneficiaryIndex === 0 ? 4 : beneficiaryIndex - 1
                  )
                }
              >
                <Icon.ChevronLeft className="text-white h-18 w-18 mr-2" />
              </button>
              <button
                className="w-24 h-24 rounded-full bg-red-500 flex justify-center items-center mr-8 hover:bg-red-600"
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
        </div>
        <div className="w-2/3">
          <BeneficiaryCard
            beneficiary={beneficiary}
            setVotes={setVotes}
            maxVotes={maxVotes}
            assignedVotes={assignedVotes}
            beneficiaryIndex={beneficiaryIndex}
          />
        </div>
      </div>
    </div>
  );
};
export default Beneficiary;
