"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Menu } from "./Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

type Category = {
  _id: string;
  categoryName: string;
};

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [cat, setCat] = useState<Category | null>(null);
  const [count, setCount] = useState<number>(-1);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/category`
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handle = (value: Category, i: number) => {
    if (count === i) {
      setIsClicked(false);
      setCount(-1);
      setCat(null);
    } else {
      setIsClicked(true);
      setCount(i);
      setCat(value);
    }
  };

  return (
    <div className="flex h-fit w-screen pt-[32px] px-[48px] flex-col items-center gap-9 bg-[#404040] pb-[134px]">
      <div className="flex px-10 justify-center items-center gap-[10px] self-stretch">
        <p className="text-white text-[30px] font-semibold">Categories</p>
      </div>

      <div className="sticky z-20 top-[72px] bg-[#404040] flex justify-center items-center gap-2 w-full px-[48px] py-3">
        <div className="flex size-10 justify-center items-center gap-2">
          <ChevronLeft />
        </div>
        <div className="flex w-fit justify-center items-center gap-2">
          {categories?.map((val, index) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              key={val._id}>
              <button
                onClick={() => handle(val, index)}
                className={`cursor-pointer flex py-1 px-5 items-start gap-[10px] rounded-full ${
                  count === index
                    ? "bg-red-500 text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }  transition-colors duration-200`}>
                <p className="text-[17px]">{val.categoryName}</p>
              </button>
            </motion.div>
          ))}
        </div>
        <div className="flex size-10 justify-center items-center gap-2">
          <ChevronRight />
        </div>
      </div>

      {isClicked && cat ? (
        <Menu categories={cat._id} name={cat.categoryName} />
      ) : (
        categories.map((varl) => (
          <Menu categories={varl._id} name={varl.categoryName} key={varl._id} />
        ))
      )}
    </div>
  );
};
