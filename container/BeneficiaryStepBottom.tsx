import Beneficiary from "components/Beneficiary";
import router from "next/router";
import { RegisteredContacts } from "pages";
import { Dispatch, useState } from "react";
import beneficiaries from "../public/beneficiaries.json";

interface BeneficiaryStepBottomProps {
  isActive: boolean;
  availableVotes: number;
  setAvailableVotes: Dispatch<number>;
  maxVotes: number;
  account: string;
  registeredContacts: RegisteredContacts;
  submitVotes: Function;
}

export default function BeneficiaryStepBottom({
  isActive,
  availableVotes,
  setAvailableVotes,
  maxVotes,
  account,
  registeredContacts,
  submitVotes,
}: BeneficiaryStepBottomProps): JSX.Element {
  const [emailError, setEmailError] = useState<boolean>(false);
  const [beneficiaryIndex, setBeneficiaryIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0, 0]);

  function updateVotes(vote: number, i: number): void {
    const newVotes = votes;
    newVotes[i] = 0;
    const oldTotal = newVotes.reduce(function (acc, val) {
      return acc + val;
    }, 0);
    if (oldTotal + vote > maxVotes) {
      setAvailableVotes(0);
      const remaining = maxVotes - oldTotal;
      newVotes[i] = remaining;
      setVotes((prevState) => newVotes);
    } else {
      newVotes[i] = vote;
      setAvailableVotes(maxVotes - (oldTotal + vote));
      setVotes((prevState) => newVotes);
    }
  }

  return (
    isActive &&
    account && (
      <>
        <div className="hidden md:block mt-1 md:mt-52 relative z-0 w-full h-full bg-no-repeat bg-center bg-contain bg-beneficiary-pattern">
          <div className="w-10/12 mx-auto h-full relative">
            <div className="w-full mx-auto h-full relative">
              <div className="w-full lg:w-2/3 mx-auto">
                <div className="relative z-10 mx-auto">
                  <Beneficiary
                    beneficiary={beneficiaries[beneficiaryIndex]}
                    setVotes={updateVotes}
                    maxVotes={maxVotes}
                    assignedVotes={votes[beneficiaryIndex]}
                    beneficiaryIndex={beneficiaryIndex}
                    setBeneficiaryIndex={setBeneficiaryIndex}
                  />
                  <div className="mt-28 pl-4 ml-24 pb-24 relative z-20">
                    <p className="text-gray-500 text-base text-center">Submit your email to finish your token claim</p>
                    <div className="relative z-20 mx-auto mt-2 shadow-lg border border-gray-100 bg-white rounded-xl py-2 px-2 w-10/12 2xl:w-8/12 flex flex-row items-center justify-between">
                      <input
                        type="email"
                        name="email"
                        className="w-10/12 p-2 border-none text-base mx-2 text-gray-900"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value.toLowerCase());
                          setEmailError(
                            !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                              e.target.value.toLowerCase()
                            )
                          );
                        }}
                      />
                      <div className="clear">
                        <input
                          type="submit"
                          value="Submit"
                          name="submit"
                          className="font-medium text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 cursor-pointer disabled:bg-gray-500"
                          disabled={
                            emailError || availableVotes > 0 || !account
                          }
                          onClick={() => {
                            if (email.length > 0 && !emailError) {
                              if (registeredContacts.emails.includes(email)) {
                                router.push("/alreadyRegistered");
                              } else {
                                submitVotes(account, email, votes);
                              }
                            } else {
                              setEmailError(true);
                            }
                          }}
                        />
                      </div>
                    </div>
                    {emailError && (
                      <p className="text-red-500 w-10/12 2xl:w-8/12 mx-auto mt-2">
                        Please enter a valid email address
                      </p>
                    )}
                  </div>
                </div>
                <img
                  src="/images/arrowCurved.svg"
                  className="absolute z-0 bottom-32 base:top-18 lg:top-14"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden w-full relative mt-6">
          <div className="relative z-10">
            <Beneficiary
              beneficiary={beneficiaries[beneficiaryIndex]}
              setVotes={updateVotes}
              maxVotes={maxVotes}
              assignedVotes={votes[beneficiaryIndex]}
              beneficiaryIndex={beneficiaryIndex}
              setBeneficiaryIndex={setBeneficiaryIndex}
            />{" "}
            <div className="relative z-20 mt-12 mb-12">
              <div className="relative z-20 mx-auto mt-5 shadow-lg border border-gray-100 bg-white rounded-xl py-2 px-2 w-10/12 2xl:w-8/12 flex flex-row items-center justify-between">
                <input
                  type="email"
                  name="email"
                  className="w-10/12 p-2 border-none text-base mx-2 text-gray-900"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.toLowerCase());
                    setEmailError(
                      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        e.target.value.toLowerCase()
                      )
                    );
                  }}
                />
                <div className="clear">
                  <input
                    type="submit"
                    value="Submit"
                    name="submit"
                    className="font-medium text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 cursor-pointer disabled:bg-gray-500"
                    disabled={emailError || availableVotes > 0 || !account}
                    onClick={() => {
                      if (email.length > 0 && !emailError) {
                        if (registeredContacts.emails.includes(email)) {
                          router.push("/alreadyRegistered");
                        } else {
                          submitVotes(account, email, votes);
                        }
                      } else {
                        setEmailError(true);
                      }
                    }}
                  />
                </div>
              </div>
              {emailError && (
                <p className="text-red-500 w-10/12 2xl:w-8/12 mx-auto mt-2">
                  Please enter a valid email address
                </p>
              )}
            </div>
          </div>
          <img src="/images/arrowCurved.svg" className="absolute z-0 top-0" />
          <img
            src="/images/arrowCurved.svg"
            className="absolute z-0 bottom-0 mb-18"
          />
        </div>
      </>
    )
  );
}
