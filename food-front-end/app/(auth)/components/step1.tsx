export const Step1 = ({
  onchange,
  name,
  down,
}: {
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  down: string;
}) => {
  return (
    <div className="flex w-[416px] flex-col gap-6">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down} </p>
      </div>
      <div className="flex w-full flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <input
            onChange={onchange}
            placeholder="Enter your email address"
            className="flex w-full px-3 py-2 items-center self-stretch rounded-md border-[#E4E4E7] border-[1px] bg-white text-[#09090B]"></input>
        </div>
      </div>
    </div>
  );
};
