import { useState } from "react";

export const Step2 = ({
  name,
  down,
  onchange,
  error,
  onch,
  value1,
  value2,
}: {
  name: string;
  down: string;
  value1: string;
  value2: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  onch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  const show = () => {
    setClicked(!clicked);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down} </p>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col w-[400px] h-fit items-start gap-2 self-stretch">
          <input
            value={value1}
            onChange={onchange}
            type={`${clicked ? "text" : "password"}`}
            placeholder="Password"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px] bg-white text-black w-full ${
              error !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            }`}></input>
        </div>
        <div className="flex w-[400px] h-[36px] items-start gap-2 self-stretch">
          <input
            value={value2}
            onChange={onch}
            type={`${clicked ? "text" : "password"}`}
            placeholder="Confirm"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px] bg-white text-black  w-full ${
              error !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            }`}></input>
        </div>
        <p className="text-[#EF4444] text-[14px] w-[400px] h-fit">{error}</p>
        <div className="flex items-center gap-2">
          <input
            onClick={show}
            type="checkbox"
            className="size-4 rounded-sm border-[1px] border-black bg-white"></input>
          <p className="text-[#71717A] text-[14px]">Show password</p>
        </div>
      </div>
    </div>
  );
};
