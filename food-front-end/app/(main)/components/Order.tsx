"use client";
import axios from "axios";
import { X } from "lucide-react";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Food = {
  _id: string;
  name: string;
  ingredients: string;
  image: string;
  price: number;
};
type Order = {
  foodId: string;
  quantity: number;
};

export const Order = ({ id, quantity }: { id: string; quantity: number }) => {
  const [food, setFood] = useState<Food | null>(null);
  const [quan, setQuan] = useState(quantity);
  const fetchFood = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/${id}`
      );
      setFood(res.data);
    } catch (error) {
      console.error("Error fetching food:", error);
    }
  };

  useEffect(() => {
    fetchFood();
  }, [id]);

  const handleIncrement = () => {
    setQuan(quan + 1);
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const existingIndex = storedOrders.findIndex((o: Order) => o.foodId === id);
    storedOrders[existingIndex].quantity += 1;
    const updatedOrders = [...storedOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    const currentCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
    localStorage.setItem("cartCount", (currentCount + 1).toString());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrement = () => {
    if (quan > 1) {
      setQuan(quan - 1);
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const existingIndex = storedOrders.findIndex(
        (o: Order) => o.foodId === id
      );
      storedOrders[existingIndex].quantity -= 1;
      const updatedOrders = [...storedOrders];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      const currentCount = parseInt(
        localStorage.getItem("cartCount") || "0",
        10
      );
      localStorage.setItem("cartCount", (currentCount - 1).toString());
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handledeleteorder = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const existingIndex = storedOrders.findIndex((o: Order) => o.foodId === id);
    const currentCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
    localStorage.setItem(
      "cartCount",
      (currentCount - storedOrders[existingIndex].quantity).toString()
    );

    storedOrders.splice(existingIndex, 1);
    const updatedOrders = [...storedOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    window.dispatchEvent(new Event("cartUpdated"));
  };
  if (!food) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-[439px] h-fit items-start text-[#09090B] gap-5">
      <div className="flex gap-[10px]">
        <img
          src={food.image}
          className="w-[124px] h-[120px] rounded-xl"
          alt={food.name}
        />
        <div className="flex flex-col items-start gap-6 self-stretch">
          <div className="flex items-start gap-[10px]">
            <div className="flex flex-col items-start w-[259px]">
              <p className="text-[#EF4444] text-[16px] font-bold">
                {food.name}
              </p>
              <p className="text-[12px] text-[#09090B] h-[32px] overflow-hidden">
                {food.ingredients}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer">
              {" "}
              <button
                onClick={handledeleteorder}
                className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full border-[1px] border-[#EF4444] hover:bg-[#EF4444] text-[#EF4444] hover:text-white">
                <X className="size-4" />
              </button>
            </motion.div>
          </div>
          <div className="flex w-[305px] justify-between items-center">
            <div className="flex justify-center items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer">
                <div
                  className={`${
                    quan <= 1
                      ? "opacity-[0.2] cursor-no-drop"
                      : "cursor-pointer "
                  } flex size-11 justify-center items-center gap-2 rounded-full border-[1px] border-[#E4E4E7] bg-white`}
                  onClick={handleDecrement}>
                  <Minus className="size-4" />
                </div>
              </motion.div>

              <p className="text-[18px] font-semibold">{quan}</p>
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer">
                <div
                  className="cursor-pointer flex size-11 justify-center items-center gap-2 rounded-full border-[1px] border-[#E4E4E7] bg-white"
                  onClick={handleIncrement}>
                  <Plus className="size-4" />
                </div>
              </motion.div>
            </div>
            <p className="w-[93px] text-[#09090B] text-[16px] font-bold">
              {food.price * quan}₮
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-[439px] h-[1px] border-[1px] border-dashed border-[#09090b80]"></div>
    </div>
  );
};
