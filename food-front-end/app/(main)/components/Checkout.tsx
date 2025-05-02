"use client";

import { motion, AnimatePresence } from "framer-motion";

import { SheetClose } from "@/components/ui/sheet";

type Order = {
  foodId: string;
  price: number;
  quantity: number;
};

export const Checkout = ({
  orders,
  onCheckoutClick,
}: {
  orders: Order[];
  onCheckoutClick: () => void;
}) => {
  const total = orders.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0
  );
  const shipping = 5000;

  return (
    <div className="flex p-4 flex-col items-start gap-4 rounded-[20px] bg-white">
      <p className="text-[20px] text-[#09090B] font-semibold">Payment info</p>
      <div className="flex w-full flex-col items-start gap-2">
        <div className="w-full flex justify-between items-start">
          <p className="text-[#71717A] text-[16px]">Items</p>
          <p className="text-[#09090B] text-[16px] font-bold">{total}₮</p>
        </div>
        <div className="w-full flex justify-between items-start">
          <p className="text-[#71717A] text-[16px]">Shipping</p>
          <p className="text-[#09090B] text-[16px] font-bold">{shipping}₮</p>
        </div>
      </div>
      <div className="w-[439px] border-[#09090b80] border-[1px] border-dashed"></div>
      <div className="flex w-full justify-between items-start">
        <p className="text-[#71717A] text-[16px]">Total</p>
        <p className="text-[#09090B] text-[16px] font-bold">
          {total + shipping}₮
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer w-full px-2">
        <SheetClose asChild>
          <button
            onClick={onCheckoutClick}
            className="cursor-pointer flex w-full h-11 py-2 px-8 justify-center items-center gap-2 rounded-full bg-[#EF4444] text-[#FAFAFA]">
            Checkout
          </button>
        </SheetClose>
      </motion.div>
    </div>
  );
};
