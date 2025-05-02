"use client";

import { motion, AnimatePresence } from "framer-motion";

export const Step4 = ({
  name,
  down,
  input,
  inputhandle,
  errmes,
  sendlink,
}: {
  name: string;
  down: string;
  input: string;
  inputhandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errmes: string;
  sendlink: () => void;
}) => {
  return (
    <div className="flex flex-col gap-6  w-[350px]">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <input
          value={input}
          onChange={inputhandle}
          placeholder="Enter your email address"
          className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px] ${
            errmes !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
          } bg-white text-black`}></input>
        <p className="text-[#EF4444] text-[14px]">{errmes}</p>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer w-full">
          <button
            onClick={sendlink}
            className="cursor-pointer flex w-full h-[36px] px-[32px] justify-center items-center rounded-md bg-black hover:bg-[#3f3f3f] text-white">
            Send link
          </button>
        </motion.div>
      </div>
    </div>
  );
};
