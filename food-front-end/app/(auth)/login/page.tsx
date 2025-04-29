"use client";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { Step3 } from "../components/step3";
import { useState } from "react";
import { Step4 } from "../components/step4";
import { Step5 } from "../components/step5";
import { Step6 } from "../components/step6";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const blah = [
    {
      name: "Log in",
      down: "Log in to enjoy your favorite dishes.",
    },
    {
      name: "Reset your password ",
      down: "Enter your email to receive a password reset link.",
    },
    {
      name: "Please verify Your Email ",
      down: "We just sent an email to Test@gmail.com. Click the link in the email to verify your account.",
    },
    {
      name: "Create new password",
      down: "Set a new password with a combination of letters and numbers for better security.",
    },
  ];

  const [step, setStep] = useState(3);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const inputhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const inputpashandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };
  console.log(email, "email");
  console.log(pass, "pass");
  const handleonclick = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/login`,
      {
        email: email,
        password: pass,
      }
    );
    localStorage.setItem("token", response.data.token);
    router.push("/");
  };

  return (
    <div className="flex pb-[110px] w-full h-full justify-center items-center ">
      <div className="flex flex-col justify-center items-start gap-6 p-10">
        <div className="flex px-1 py-1 size-[36px] justify-center items-center gap-2 rounded-md border-[#E4E4E7] border-[1px] bg-white">
          <IoIosArrowBack className="text-black" />
        </div>

        {/* Step 3 */}
        <Step3
          name={blah[0].name}
          down={blah[0].down}
          input={inputhandler}
          inputpas={inputpashandler}
          email={email}
          pass={pass}
        />

        {/* Step 4 */}
        {step === 4 && <Step4 name={blah[1].name} down={blah[1].down} />}

        {/* Step 5 */}
        {step === 5 && <Step5 name={blah[2].name} down={blah[2].down} />}

        {/* Step 6 */}
        {step === 6 && <Step6 name={blah[3].name} down={blah[3].down} />}

        <div
          className={`${
            step === 3 ? "flex" : "hidden"
          } items-center gap-3 self-stretch`}>
          <button
            onClick={handleonclick}
            className="cursor-pointer flex w-[352px] h-[36px] px-[32px] justify-center items-center gap-2 rounded-md bg-[#d1d1d1] text-[#FAFAFA]">
            Let's Go
          </button>
        </div>

        {(step === 3 || step === 4) && (
          <div className="flex justify-center gap-3 self-stretch text-[16px]">
            <p className="text-[#71717A]">Don't have an account?</p>
            <p className="text-[#2563EB]">Sign up</p>
          </div>
        )}
      </div>
    </div>
  );
}
