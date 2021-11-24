interface BeneficiaryStepTopProps {
  isActive: boolean;
  maxVotes: number;
  availableVotes:number;
}

export default function BeneficiaryStepTop({
  maxVotes,
  isActive,
  availableVotes
}: BeneficiaryStepTopProps): JSX.Element {
  return (
    isActive && (
      <>
        <div className="h-full flex flex-row items-center mx-auto mt-6 xl:mt-10 2xl:mt-14">
          <div className="rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 border-gray-800 flex justify-center items-center">
            <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold">1</p>
          </div>
          <img src={`/images/arrowBlack.svg`} className="mx-2" />
          <div
            className={`rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 flex justify-center items-center border-black`}
          >
            <p
              className={`text-lg xl:text-xl 2xl:text-2xl font-semibold text-black`}
            >
              2
            </p>
          </div>
        </div>
        <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold mx-auto text-center w-1/3 mt-8 2xl:mt-12">
          Step 2: You can now allocate {maxVotes} token between the
          organizations below to claim your POP.
        </p>
        <div className="mx-auto w-80 border border-gray-900 rounded-xl mt-8 py-4">
          <h1 className="text-5xl text-center font-medium">
            {availableVotes} POP
          </h1>
        </div>
        <div className="w-2 h-14"></div>
      </>
    )
  );
}
