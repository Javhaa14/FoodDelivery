"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const Step6 = ({ name, down }: { name: string; down: string }) => {
  const [pass, setPass] = useState("");
  const [passconfirm, setPassconfirm] = useState("");
  const [clicked, setClicked] = useState(false);
  const [passmes, setPassmes] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const show = () => {
    setClicked(!clicked);
  };
  const resetpass = async () => {
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
          console.log("Sending token:", token);

          axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/ress`,
            {
              password: passconfirm,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log(error);
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
  };
  const passhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };
  const passconfhandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassconfirm(event.target.value);
  };
  return (
    <div className="flex flex-col gap-6 w-[400px]">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex w-[400px] h-[36px] items-start gap-2 self-stretch">
          <input
            value={pass}
            onChange={passhandler}
            type={`${clicked ? "text" : "password"}`}
            placeholder="Password"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px]  ${
              passmes !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            } bg-white text-black  w-full`}></input>
        </div>
        <div className="flex w-[400px] h-[36px] items-start gap-2 self-stretch">
          <input
            value={passconfirm}
            onChange={passconfhandler}
            type={`${clicked ? "text" : "password"}`}
            placeholder="Confirm"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px]  ${
              passmes !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            } bg-white text-black  w-full`}></input>
        </div>
        <p className="text-[#EF4444] text-[14px] w-[400px] h-fit">{passmes}</p>
        <div className="flex items-center gap-2">
          <input
            onClick={show}
            type="checkbox"
            className="size-4 rounded-sm border-[1px] border-black bg-white"></input>

          <p className="text-[#71717A] text-[14px]">Show password</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer">
          <button
            onClick={resetpass}
            className="cursor-pointer flex w-full h-[36px] px-[32px] justify-center items-center rounded-md bg-black hover:bg-[#3f3f3f] text-white">
            Create new password
          </button>
        </motion.div>
      </div>
    </div>
  );
};
