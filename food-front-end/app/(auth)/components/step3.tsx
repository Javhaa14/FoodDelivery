export const Step3 = ({
  name,
  down,
  input,
  inputpas,
  email,
  pass,
  err,
  forgot,
}: {
  name: string;
  down: string;
  input: any;
  inputpas: any;
  email: string;
  pass: string;
  err: string;
  forgot: () => void;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-1 self-stretch text-[#09090B]">
        <h3 className="text-[24px] font-semibold">{name}</h3>
        <p className="text-4 text-[#71717A]">{down}</p>
      </div>
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex w-[350px] h-[36px] items-start gap-2 self-stretch">
          <input
            value={email}
            onChange={input}
            placeholder="Enter your email address"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white text-black w-full ${
              err !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            }`}
          />
        </div>
        <div className="flex w-[350px] h-[36px] items-start gap-2 self-stretch">
          <input
            type="password"
            value={pass}
            onChange={inputpas}
            placeholder="Password"
            className={`flex px-3 py-2 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white text-black w-full ${
              err !== "" ? "border-[#EF4444]" : "border-[#E4E4E7]"
            }`}
          />
        </div>
        <p className="text-[#EF4444] text-[14px]">{err}</p>
        <p
          onClick={forgot}
          className="text-[#18181B] hover:text-red-500 text-[14px] underline decoration-solid cursor-pointer"
        >
          Нууц үгээ мартсан уу?
        </p>
      </div>
    </div>
  );
};
