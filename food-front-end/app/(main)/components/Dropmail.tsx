export const Dropmail = ({
  mail,
  onclick,
}: {
  mail: string;
  onclick: () => void;
}) => {
  return (
    <div className="flex w-[184px] overflow-hidden p-4 flex-col justify-center items-start gap-2 absolute right-[-75px] bottom-[-110px] rounded-xl bg-white text-[#09090B] ">
      <p className="text-[20px] font-semibold">{mail}</p>
      <button
        onClick={onclick}
        className="cursor-pointer ml-[30px] flex h-[36px] py-2 px-4 justify-center items-center gap-2 rounded-full bg-[#F4F4F5] hover:bg-[#bababa]">
        Sign out
      </button>
    </div>
  );
};
