"use client";
import Cookies from "js-cookie";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Foodcard } from "./Foodcard";
import { Fooddetail } from "./Fooddetail";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Check } from "lucide-react";

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

export const Menu = ({
  name,
  categories,
}: {
  name: string;
  categories: string;
}) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const isLoggedIn = Cookies.get("Loggedin") === "true";

  const fetchFoods = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/category/${categories}`
    );
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, [categories]);
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const addOrder = (foodId: string, price: number) => {
    if (isLoggedIn == true) {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const existingIndex = storedOrders.findIndex(
        (o: Order) => o.foodId === foodId
      );

      let updatedOrders;
      if (existingIndex !== -1) {
        storedOrders[existingIndex].quantity += 1;
        updatedOrders = [...storedOrders];
      } else {
        updatedOrders = [...storedOrders, { foodId, price, quantity: 1 }];
      }

      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      const currentCount = parseInt(
        localStorage.getItem("cartCount") || "0",
        10
      );
      localStorage.setItem("cartCount", (currentCount + 1).toString());
      toast.custom((t) => (
        <div
          className={`w-[320px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all border-[1px] border-white`}>
          <Check className="size-4 text-white" />
          <span className="text-[16px] font-medium text-[#FAFAFA]">
            Food is being added to the cart!
          </span>
        </div>
      ));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      toast.custom((t) => (
        <div
          className={`max-w-[320px] w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all border-[1px] border-white`}>
          <Check className="size-4 text-white" />
          <span className="text-[16px] font-medium text-[#FAFAFA]">
            Please Login First!
          </span>
        </div>
      ));
    }
  };

  return (
    <div className="flex w-[1264px] flex-col items-start gap-9 bg-[#404040] px-[68px]">
      <Toaster position="top-center" />
      <p className="text-white text-[30px] font-semibold">{name}</p>
      <div className="grid grid-cols-3 items-start gap-9 self-stretch">
        {foods.map((val) => {
          return (
            <div key={val.name} className="relative flex justify-end items-end">
              <Dialog>
                <DialogTrigger>
                  <Foodcard
                    key={val.name}
                    name={val.name}
                    price={val.price}
                    ingredients={val.ingredients}
                    image={val.image}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>
                    <p className="hidden"></p>
                  </DialogTitle>
                  <Fooddetail
                    key={val._id}
                    name={val.name}
                    price={val.price}
                    ingredients={val.ingredients}
                    image={val.image}
                    id={val._id}
                  />
                </DialogContent>
              </Dialog>
              <button
                onClick={() => {
                  addOrder(val._id, val.price);
                }}
                className="cursor-pointer flex size-11 justify-center items-center gap-2 rounded-full bg-white hover:bg-black mr-6 mb-35 absolute z-10">
                <Plus className="text-[#EF4444] size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
