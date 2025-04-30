"use client";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { Step1 } from "../components/step1";
import { Step2 } from "../components/step2";
import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { X } from "lucide-react";
import * as Yup from "yup";
import { error } from "console";
import { useRouter } from "next/navigation";

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
          .required("Email is required"),
      });
      try {
        await validationSchema.validate({ email });
        setErrmes("");
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/check`,
            {
              email: email,
            }
          );
          setStep(2);
        } catch (error: any) {
          setErrmes(
            error.response ? error.response.data.message : "Network Error"
          );
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
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
            "Password is too weak. Use uppercase, lowercase, number, and special character."
          ),
      });
      try {
        await validationSchema.validate({ password: pass });

        if (pass == passconfirm) {
          setPassmes("");
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user`,
              {
                email: email,
                password: pass,
                phoneNumber: "99999999",
                address: "",
                isVerified: true,
              }
            );
          } catch (err: any) {
            console.log(err.message);
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
  const handleonclick = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/login`
    );
  };
  const goback = () => {
    setStep(1);
    setPassmes("");
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
          <button
            onClick={handle}
            className="cursor-pointer flex w-full h-[36px] px-[32px] justify-center items-center gap-2 rounded-md bg-[#18181B] text-[#FAFAFA]">
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
      <Toaster position="top-center" />
    </div>
  );
}
