"use client";

import { Soup, Timer, Map } from "lucide-react";

interface FoodItem {
  food: {
    name: string;
  };
  quantity: number;
}

interface UserOrderProps {
  total: number;
  orderban: string | number;
  state: "PENDING" | "Cancelled" | "Delivered" | string;
  foodname: FoodItem[];
  date: string;
  add: string;
}

export const Userorder = ({
  total,
  orderban,
  state,
  foodname,
  date,
  add,
}: UserOrderProps) => {
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
    <div className="flex px-3 flex-col items-start gap-3 self-stretch">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2 text-[#09090B] font-bold text-[16px]">
          <p>{total}₮</p>
          <p>(#{orderban})</p>
        </div>
        <div
          className={`flex px-[10px] h-[32px] gap-[10px] justify-center items-center rounded-full border-[1px] ${
            state === "PENDING" ? "border-[#EF4444]" : ""
          } ${state === "Cancelled" ? "border-[#E4E4E7]" : ""} ${
            state === "Delivered" ? "border-[#18ba5180]" : ""
          } text-[#09090B] text-[12px] font-semibold`}>
          {state}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[10px]">
        {foodname.map((val, index) => (
          <div
            key={index}
            className="flex w-full justify-between items-center text-[#71717A] text-[12px]">
            <div className="flex gap-2 items-center">
              <Soup className="size-4" />
              <p>{val.food.name}</p>
            </div>
            <p>x{val.quantity}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-[#71717A] text-[12px]">
        <Timer className="size-4" />
        <p>{formattedDate}</p>
      </div>
      <div className="flex items-start gap-2 text-[#71717A] text-[12px]">
        <Map className="size-4" />
        <p>{add}</p>
      </div>
      <div className="w-[439px] h-[1px] border-[1px] border-[#09090b80] border-dashed"></div>
    </div>
  );
};
