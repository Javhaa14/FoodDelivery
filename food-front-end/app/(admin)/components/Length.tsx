"use client";

import axios from "axios";
import { useEffect, useState } from "react";
type Food = {
  _id: string;
  name: string;
  ingredients: string;
  image: string;
  price: number;
};
export const Length = ({ id }: { id: string }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  useEffect(() => {
    if (!id) return;
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/category/${id}`
        );
        setFoods(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch foods:", error);
      }
    };
    fetchFoods();
  }, [id]);

  return (
    <div
      className="flex py-[2px] px-[10px] items-start
        gap-[10px] rounded-full bg-[#18181B]">
      <p className="tetx-[12px] text-[#FAFAFA]">{foods.length}</p>
    </div>
  );
};
