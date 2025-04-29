export const Step5 = ({ name, down }: { name: string; down: string }) => {
  return (
    <div className="flex flex-col gap-6 w-[416px]">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <button className="flex w-full h-[36px] px-[32px] justify-center items-center rounded-md bg-[#18181B] text-white">
        Resend email
      </button>
    </div>
  );
};
