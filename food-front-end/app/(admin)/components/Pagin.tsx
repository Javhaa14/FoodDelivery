type PaginProps = {
  index: number | string;
};

export const Pagin = ({ index }: PaginProps) => {
  return (
    <div className="flex size-[32px] py-2 px-4 justify-center items-center gap-2 rounded-full border-[1px] border-[#E2E8F0] bg-white shadow-sm">
      {index}
    </div>
  );
};
