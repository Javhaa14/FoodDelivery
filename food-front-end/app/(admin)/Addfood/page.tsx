"use client";
import { Plus } from "lucide-react";
import axios from "axios";
import { List } from "../components/List";
import { useEffect, useState } from "react";
import { Length } from "../components/Length";
import { Check } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Minus } from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
type Category = {
  _id: string;
  categoryName: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newcat, setNewcat] = useState({ categoryName: "" });
  const [isClicked, setIsClicked] = useState(false);
  const [isClickedall, setIsClickedall] = useState(false);
  const [cat, setCat] = useState<Category | null>(null);
  const [count, setCount] = useState<number>(-1);
  const [allfoods, setAllfoods] = useState([]);
  const [delid, setDelid] = useState("");
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
  const Allfoods = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food`
      );
      setAllfoods(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
    Allfoods();
  }, []);

  const handlecategory = () => {
    const name = newcat.categoryName;
    if (name === "" || !name.replace(/\s/g, "").length) {
      alert("Category name cannot be empty.");
      return;
    }
    const exists = categories.some(
      (cat) => cat.categoryName.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert("Category already exists.");
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/category`, newcat)
      .then(() => {
        fetchCategories();
        toast.custom(() => (
          <div
            className={`w-[400px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all`}>
            <Check className="size-4 text-white" />
            <span className="text-[16px] font-medium text-[#FAFAFA]">
              New Category is being added to the menu
            </span>
          </div>
        ));
      })
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
      });
  };
  const handledelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelid(e.target.value);
  };
  const handledel = (id: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/category`, {
        data: { id },
      })
      .then(() => {
        fetchCategories();
        toast.custom(() => (
          <div className="w-[400px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all">
            <Check className="size-4 text-white" />
            <span className="text-[16px] font-medium text-[#FAFAFA]">
              Category is successfully deleted
            </span>
          </div>
        ));
      })
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
      });
  };

  const selectedCat = categories.find(
    (val) => val.categoryName === delid.trim()
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewcat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handle = (value: Category, i: number) => {
    if (count === i) {
      setIsClicked(false);
      setCount(-1);
      setCat(null);
      setIsClickedall(false);
    } else {
      setIsClicked(true);
      setCount(i);
      setCat(value);
      setIsClickedall(false);
    }
  };
  const ho = () => {
    setIsClicked(false);
    setCat(null);
    setIsClickedall(true);
  };
  return (
    <div className="flex flex-col ml-[204px] px-[24px] pt-[24px] gap-6">
      <Toaster position="top-center" />
      <div className="flex w-[1171px] flex-col items-end gap-6">
        <div className="flex items-start gap-[10px] ">
          <div className="flex w-full justify-end gap-2">
            <img src="globe.svg" className="size-[36px] rounded-full"></img>
          </div>
        </div>
        <div className="flex-col w-[1180px] flex p-6 items-start gap-4 self-stretch rounded-xl bg-white relative justify-center">
          <p className="text-[20px] text-[#09090B] font-semibold">
            Dishes category
          </p>
          <div className="flex flex-wrap gap-2">
            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer">
              <button
                onClick={ho}
                className={`cursor-pointer flex h-[36px] py-2 px-4 items-center gap-2 rounded-full border-[1px] ${
                  isClicked && cat ? "border-[#e4e4e5]" : "border-[#ef4444]"
                }  bg-[#FFFFFF]`}>
                <p className="text-[#18181B] text-[14px] font-medium">
                  Бүх хоол
                </p>
                <div className="flex py-[2px] px-[10px] items-start gap-[10px] rounded-full bg-[#18181B]">
                  <p className="tetx-[12px] text-[#FAFAFA]">
                    {allfoods.length}
                  </p>
                </div>
              </button>
            </motion.div>

            {categories.map((el, index) => {
              return (
                <motion.div
                  key={el._id}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer">
                  <button
                    key={el._id}
                    onClick={() => handle(el, index)}
                    className={`cursor-pointer flex h-[36px] py-2 px-4 items-center gap-2 rounded-full border-[1px] ${
                      count === index && isClickedall == false
                        ? "border-[#ef4444]"
                        : "border-[#e4e4e5]"
                    } bg-[#FFFFFF]`}>
                    <p className="text-[#18181B] text-[14px] font-medium">
                      {el.categoryName}
                    </p>
                    <Length id={el._id} />
                  </button>
                </motion.div>
              );
            })}
            <Dialog>
              <DialogTrigger>
                <motion.div
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer">
                  <div className="cursor-pointer flex size-10 justify-center items-center gap-2 rounded-full bg-[#EF4444]">
                    <Plus />
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  <p className="hidden"></p>
                </DialogTitle>
                <div className="w-[460px] p-6 flex flex-col items-start gap-[24px] rounded-xl bg-white">
                  <div className="flex pb-4 justify-start items-center gap-[10px] self-stretch">
                    <p className="text-[#09090B] text-[18px] font-semibold  ">
                      Add new category
                    </p>
                  </div>
                  <div className="flex w-full items-start gap-2 flex-col h-[60px] text-black">
                    <label className="flex items-start text-[14px] font-medium">
                      Category name
                    </label>
                    <input
                      name="categoryName"
                      onChange={handleChange}
                      placeholder="Type category name..."
                      className="flex w-full py-2 px-3 items-center rounded-[6px] border-[1px] border-[#E4E4E7] bg-white"></input>
                  </div>
                  <DialogClose>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer">
                      <div
                        onClick={handlecategory}
                        className="cursor-pointer flex h-[40px] ml-[290px] mt-[24px] justify-contenet items-end gap-4 self-stretch rounded-md bg-[#18181B]">
                        <p className="text-[#fff] text-[14px] py-2 px-4">
                          Add Category
                        </p>
                      </div>
                    </motion.div>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <motion.div
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer">
                  <div className="cursor-pointer flex size-10 justify-center items-center gap-2 rounded-full bg-[#EF4444]">
                    <Minus />
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  <p className="hidden"></p>
                </DialogTitle>
                <div className="w-[460px] p-6 flex flex-col items-start gap-[24px] rounded-xl bg-white">
                  <div className="flex pb-4 justify-start items-center gap-[10px] self-stretch">
                    <p className="text-[#09090B] text-[18px] font-semibold  ">
                      Delete Category
                    </p>
                  </div>
                  <div className="flex w-full items-start gap-2 flex-col h-[60px] text-black">
                    <label className="flex items-start text-[14px] font-medium">
                      Category name
                    </label>
                    <input
                      name="categoryName"
                      onChange={handledelChange}
                      placeholder="Type category name..."
                      className="flex w-full py-2 px-3 items-center rounded-[6px] border-[1px] border-[#E4E4E7] bg-white"></input>
                  </div>
                  <DialogClose>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer">
                      <div
                        onClick={() => {
                          if (selectedCat) handledel(selectedCat._id);
                          else alert("Category not found.");
                        }}
                        className="cursor-pointer w-[120px] flex h-[40px] ml-[290px] mt-[24px] justify-center items-end gap-4 self-stretch rounded-md bg-[#18181B]">
                        <p className="text-[#fff] text-[14px] py-2 px-4 ">
                          Delete
                        </p>
                      </div>
                    </motion.div>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="flex w-[1171px] h-fit flex-col items-start pb-10 gap-5">
        {isClicked && cat ? (
          <List categoryname={cat.categoryName} id={cat._id} />
        ) : (
          categories.map((g) => {
            return (
              <List key={g._id} categoryname={g.categoryName} id={g._id} />
            );
          })
        )}
      </div>
    </div>
  );
}
