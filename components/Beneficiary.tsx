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
    <>
      <div className="w-full relative z-20 pt-40">
        <div className="flex flex-row flex-wrap  justify-center items-start mx-auto w-full 2xl:w-8/12">
          <div className="">
            <img
              className="w-full h-104 object-cover rounded-3xl"
              src={`/images/${beneficiary.image.image}`}
              alt={beneficiary.image.description}
            />
            <div className="flex flex-row justify-end w-full mt-8">
              <div className="hidden sm:hidden md:flex lg:flex lg:flex-row md:flex-row sm:flex-column flex-nowrap items-center justify-end mb-8 mt-8">
                <button
                  className="w-24 h-24 mr-8 rounded-full bg-red-500 flex justify-center items-center flex-shrink-0 flex-grow-0 hover:bg-red-600"
                  onClick={() =>
                    setBeneficiaryIndex(
                      beneficiaryIndex === 0 ? 4 : beneficiaryIndex - 1
                    )
                  }
                >
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
        <div className="md:hidden flex flex-row items-center justify-between w-8/12 mt-8 mx-auto">
          <button
            className="w-18 h-18 rounded-full bg-red-500 flex justify-center items-center flex-shrink-0 flex-grow-0 hover:bg-red-600"
            onClick={() =>
              setBeneficiaryIndex(
                beneficiaryIndex === 0 ? 4 : beneficiaryIndex - 1
              )
            }
          >
            <Icon.ChevronLeft className="text-white h-12 w-12 mr-2" />
          </button>
          <button
            className="w-18 h-18 rounded-full bg-red-500 flex justify-center items-center flex-shrink-0 flex-grow-0 hover:bg-red-600"
            onClick={() =>
              setBeneficiaryIndex(
                beneficiaryIndex === 4 ? 0 : beneficiaryIndex + 1
              )
            }
          >
            <Icon.ChevronRight className="text-white h-12 w-12 ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};
export default Beneficiary;
