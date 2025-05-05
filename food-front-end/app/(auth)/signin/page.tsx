"use client";
import { IoIosArrowBack } from "react-icons/io";
import { Step1 } from "../components/step1";
import { Step2 } from "../components/step2";
import { useState } from "react";
import axios from "axios";
import { Toaster } from "sonner";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

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
  const [pass, setPass] = useState("");
  const [passconfirm, setPassconfirm] = useState("");
  const [step, setStep] = useState(1);
  const [errmes, setErrmes] = useState("");
  const [passmes, setPassmes] = useState("");

  const mailhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const passhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };
  const passconfhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassconfirm(event.target.value);
  };
  console.log(email);
  const handle = async () => {
    if (step == 1) {
      const validationSchema = Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required")
          .test("includes-com-and-at", "Invalid email address", (value) => {
            if (!value) return false;
            return value.includes("@") && value.includes(".com");
          }),
      });
      try {
        await validationSchema.validate({ email });
        setErrmes("");
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/check`,
            {
              email: email,
            }
          );
          setStep(2);
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response) {
            setErrmes(error.response.data.message);
          } else {
            setErrmes("Network Error");
            console.error("Unexpected error:", error);
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setErrmes(err.message);
        }
      }
    } else {
      const validationSchema = Yup.object({
        password: Yup.string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_-])[A-Za-z\d@$!%*?#&_-]{8,}$/,
            "Password is too weak. Use uppercase, lowercase, number, and special character."
          ),
      });
      try {
        await validationSchema.validate({ password: pass });

        if (pass == passconfirm) {
          setPassmes("");
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user`,
              {
                email: email,
                password: pass,
                phoneNumber: "99999999",
                address: "",
                isVerified: true,
              }
            );
          } catch (err: unknown) {
            console.log(err);
          }
          router.push("/login");
        } else {
          setPassmes("Those password did’t match, Try again");
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setPassmes(err.message);
        }
      }
    }
  };
  const goback = () => {
    setStep(1);
    setPassmes("");
  };
  const handlesign = () => {
    router.push("/login");
  };
  return (
    <div className="w-full h-full justify-center items-center flex pb-[110px]">
      <div className="flex flex-col justify-center items-start gap-6 p-10">
        {step == 2 && (
          <div
            onClick={goback}
            className="cursor-pointer flex px-1 py-1 size-[36px] justify-center items-center gap-2 rounded-md border-[#E4E4E7] border-[1px] bg-white">
            <IoIosArrowBack className="text-black" />
          </div>
        )}
        {step == 1 ? (
          <Step1
            error={errmes}
            value={email}
            onchange={mailhandler}
            name={blah[0].name}
            down={blah[0].down}
          />
        ) : (
          <Step2
            value1={pass}
            value2={passconfirm}
            error={passmes}
            onchange={passhandler}
            onch={passconfhandler}
            name={blah[1].name}
            down={blah[1].down}
          />
        )}

        <div className="flex w-full items-center gap-3 self-stretch">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full">
            <button
              onClick={handle}
              className="cursor-pointer flex w-[352px] h-[36px] px-[32px] justify-center items-center gap-2 rounded-md bg-black hover:bg-[#3f3f3f] text-[#FAFAFA]">
              Let&apos;s Go
            </button>
          </motion.div>
        </div>
        <div className="flex justify-center gap-3 self-stretch text-[16px]">
          <p className="text-[#71717A] ">Already have an account?</p>
          <p
            onClick={handlesign}
            className="text-[#2563EB] hover:text-[#ff5151] cursor-pointer">
            Log in
          </p>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
