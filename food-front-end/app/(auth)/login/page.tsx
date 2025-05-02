"use client";
import Cookies from "js-cookie";

import { IoIosArrowBack } from "react-icons/io";
import { Step3 } from "../components/step3";
import { useState } from "react";
import { Step4 } from "../components/step4";
import { Step5 } from "../components/step5";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");

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
      down: `We just sent an email to "${input}". Click the link in the email to verify your account.`,
    },
    {
      name: "Create new password",
      down: "Set a new password with a combination of letters and numbers for better security.",
    },
  ];

  const [step, setStep] = useState(3);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errmes, setErrmes] = useState("");
  const [existmes, setExistmes] = useState("");

  const inputhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const inputpashandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };
  const handleonclick = async () => {
    if (email == "" && pass == "") {
      setErrmes("Имэйл эсвэл нууц үгээ бүрэн оруулна уу");
    } else if (email == "") {
      setErrmes("Имэйлээ бүрэн оруулна уу");
    } else if (pass == "") {
      setErrmes("Нууц үгээ бүрэн оруулна уу");
    } else {
      setErrmes("");
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/login`,
          {
            email: email,
            password: pass,
          }
        );
        localStorage.setItem("token", response.data.token);
        Cookies.set("Loggedin", "true", { expires: 7 });
        router.push("/");
      } catch (error: any) {
        if (error.response) {
          setErrmes(error.response.data.message);
        }
      }
    }
  };
  const handlesign = () => {
    console.log("hi");
    router.push("/signin");
  };
  const forgot = () => {
    setStep(4);
  };
  const goback = () => {
    setStep(step - 1);
  };

  const sendlink = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/check`,
        {
          email: input,
        }
      );
      setExistmes("Хэрэглэгч байхгүй байна");
      console.log(errmes);
    } catch (error: any) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/login/mail`,
          {
            email: input,
          }
        );
        setExistmes("");
        setStep(5);
      } catch (err) {
        console.error("Can't send", err);
      }
    }
  };
  const inputhandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <div className="flex pb-[110px] w-full h-full justify-center items-center ">
      <div className="flex flex-col justify-center items-start gap-6 p-10">
        {step > 3 && (
          <motion.div
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full">
            <div
              onClick={goback}
              className="cursor-pointer flex px-1 py-1 size-[36px] justify-center items-center gap-2 rounded-md border-[#E4E4E7] border-[1px] bg-white hover:bg-black text-black hover:text-white">
              <IoIosArrowBack className="" />
            </div>
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Step3
            err={errmes}
            name={blah[0].name}
            down={blah[0].down}
            input={inputhandler}
            inputpas={inputpashandler}
            email={email}
            pass={pass}
            forgot={forgot}
          />
        )}

        {/* Step 4 */}
        {step === 4 && (
          <Step4
            input={input}
            inputhandle={inputhandle}
            errmes={existmes}
            sendlink={sendlink}
            name={blah[1].name}
            down={blah[1].down}
          />
        )}

        {/* Step 5 */}
        {step === 5 && (
          <Step5 sendlink={sendlink} name={blah[2].name} down={blah[2].down} />
        )}

        <div
          className={`${
            step === 3 ? "flex" : "hidden"
          } items-center gap-3 self-stretch`}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full">
            <button
              onClick={handleonclick}
              className="cursor-pointer flex w-[352px] h-[36px] px-[32px] justify-center items-center gap-2 rounded-md  bg-black hover:bg-[#3f3f3f] text-[#FAFAFA]">
              Let's Go
            </button>
          </motion.div>
        </div>

        {(step === 3 || step === 4) && (
          <div className="flex justify-center gap-3 self-stretch text-[16px]">
            <p className="text-[#71717A]">Бүртгэлгүй юу?</p>
            <p
              onClick={handlesign}
              className="text-[#2563EB] hover:text-[#ff5151] cursor-pointer">
              Бүртгүүлэх
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
