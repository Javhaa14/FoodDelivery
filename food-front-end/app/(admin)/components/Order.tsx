import { ChevronsUpDown } from "lucide-react";

type FoodOrderItem = {
  _id: string;
  food: {
    image: string
    name: string;
  };
  quantity: number;
};
type OrderProps = {
  no: number;
  customer: string;
  food: number;
  date: string;
  total: number;
  address: string;
  state: "Pending" | "Delivered" | "Cancelled";
  foodorderitem: FoodOrderItem[];
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
};

export const Order = ({
  no,
  customer,
  food,
  date,
  total,
  address,
  state,
  foodorderitem,
  isChecked,
  onCheckChange,
}: OrderProps) => {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
  const formattedDate = formatDate(date);

  return (
    <div
      className={`flex items-start self-stretch h-[56px] ${
        isChecked ? "bg-[#F4F4F5]" : "bg-white"
      }`}>
      <div className="flex p-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <input
          checked={isChecked}
          type="checkbox"
          className="accent-[#09090B] cursor-pointer rounded-sm focus:ring-[#18181B]"
          onChange={(e) => onCheckChange(e.target.checked)}></input>
      </div>
      <div className="flex p-[9px] w-[56px] justify-center items-center gap-[10px] border-b-[1px] border-b-[#E4E4E7]">
        <p className="text-[#09090B] text-[14px] my-2">{no}</p>
      </div>
      <div className="flex w-[214px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <p className="text-[#71717A] text-[14px]">{customer}</p>{" "}
      </div>
      <div
        className={`cursor-pointer flex w-[160px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7] text-[#71717A] hover:text-black`}>
        <div className="group relative text-[14px]">
          {food} foods
          <div className="hidden group-hover:flex w-[263px] h-fit flex-col items-start gap-3 absolute top-9 left-0 mt-2 bg-white text-[#09090B] p-3 rounded-md shadow-lg z-10 border-[1px] border-[#18181b]">
            {foodorderitem.map((v: FoodOrderItem) => {
              return (
                <div
                  key={v._id}
                  className="flex items-center gap-[10px] self-stretch text-[#09090B] text-[12px] ">
                  <img
                    src={v.food?.image||"No image"}
                    alt="No image"
                    className="size-[32px] rounded-sm"></img>
                  <p>{v.food?.name||"Food Deleted"}</p>
                  <p>x{v.quantity}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex w-[160px] px-4 justify-between items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <p className="text-[#71717A] text-[14px]">{formattedDate}</p>{" "}
      </div>
      <div className="flex w-[130px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <p className="text-[#71717A] text-[14px]">{total}₮</p>{" "}
      </div>
      <div className="flex w-[244px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <p className="text-[#71717A] text-[14px]">{address}</p>{" "}
      </div>
      <div className="flex w-[160px] px-4 justify-between items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
        <div
          className={`flex w-[104px] px-[10px] h-[32px] justify-between items-center rounded-full border-[3px] ${
            state == "Pending" && "border-[#EF4444]"
          } ${state == "Cancelled" && "border-[#E4E4E7]"} ${
            state == "Delivered" && "border-[#18ba5180]"
          } text-[#09090B] text-[12px] font-semibold`}>
          {state}
          <ChevronsUpDown className="text-[#09090B] size-4" />
        </div>
      </div>
    </div>
  );
};
