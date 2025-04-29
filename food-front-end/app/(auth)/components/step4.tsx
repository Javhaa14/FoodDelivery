export const Step4 = ({ name, down }: { name: string; down: string }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex w-[400px] h-[36px] items-start gap-2 self-stretch">
          <input
            placeholder="Enter your email address"
            className="flex px-3 py-2 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white text-black w-full"></input>
        </div>
        <button className="flex w-full h-[36px] px-[32px] justify-center items-center rounded-md bg-[#18181B] text-white">
          Send link
        </button>
      </div>
    </div>
  );
};
