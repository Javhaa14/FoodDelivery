"use client";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { Step1 } from "../components/step1";
import { Step2 } from "../components/step2";
import { useState } from "react";
import { log } from "node:console";
import { Step3 } from "../components/step3";
export default function Home() {
  const blah = [
    {
      name: "Create your account",
      down: "Sign up to explore your favorite dishes.",
    },
    {
      name: "Create a strong password",
      down: "Create a strong password with letters, numbers.",
    },
    {
      name: "Log in ",
      down: "Log in to enjoy your favorite dishes.",
    },
  ];
  const [email, setEmail] = useState("");
  const inputhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  console.log(email);

  return (
    <div className="w-full h-full justify-center items-center flex pb-[110px]">
      <div className="flex flex-col justify-center items-start gap-6 p-10">
        <div className="flex px-1 py-1 size-[36px] justify-center items-center gap-2 rounded-md border-[#E4E4E7] border-[1px] bg-white">
          <IoIosArrowBack className="text-black" />
        </div>
        <Step1
          onchange={inputhandler}
          name={blah[0].name}
          down={blah[0].down}
        />
        {/* <Step2 name={blah[1].name} down={blah[1].down} /> */}
        <div className="flex w-full items-center gap-3 self-stretch">
          <button className="flex w-full h-[36px] px-[32px] justify-center items-center gap-2 rounded-md bg-[#18181B] text-[#FAFAFA]">
            Let's Go
          </button>
        </div>
        <div className="flex justify-center gap-3 self-stretch text-[16px]">
          <p className="text-[#71717A] ">Already have an account?</p>
          <a href="http://localhost:3000/login" className="text-[#2563EB]">
            Log in{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
