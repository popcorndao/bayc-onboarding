interface EndStepProps {
  isActive: boolean;
}

export default function EndStep({ isActive }: EndStepProps): JSX.Element {
  return (
    isActive && (
      <>
        <div className="mx-auto mb-14 mt-6 xl:mt-10 2xl:mt-14">
          <p className="text-xl xl:text-2xl 2xl:text-4xl mt-2 base:mt-8 2xl:mt-12 mx-auto text-gray-900 font-semibold text-center">
            Congratulations! You are in!
          </p>
          <p className="text-lg xl:text-xl 2xl:text-3xl mt-1 2xl:mt-12 mx-auto text-gray-900 font-light text-center w-10/12 base:w-full">
            We will send you an email in a few days once the airdrop is ready.
          </p>
        </div>
      </>
    )
  );
}
