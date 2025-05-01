export const Step5 = ({
  name,
  down,
  sendlink,
}: {
  name: string;
  down: string;
  sendlink: () => void;
}) => {
  return (
    <div className="flex flex-col gap-6 w-[416px]">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <button
        onClick={sendlink}
        className="cursor-pointer flex w-full h-[36px] px-[32px] justify-center items-center rounded-md bg-black hover:bg-[#3f3f3f] text-white"
      >
        Resend email
      </button>
    </div>
  );
};
