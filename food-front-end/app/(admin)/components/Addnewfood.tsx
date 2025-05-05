"use client";
import axios from "axios";
import { Image } from "lucide-react";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

type Food = {
  _id: string;
  name: string;
  ingredients: string;
  image: string;
  price: number;
  category: string;
};
export const AddNewfood = ({ id }: { id: string }) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [inputval, setInputval] = useState("");
  const [newfoods, setNewfoods] = useState<Partial<Food>>({});
  const imagehandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Cloudinary upload response:", data);
    console.log("Uploaded image URL:", data.secure_url);
    setInputval(data.secure_url);
    setNewfoods((prev) => ({
      ...prev,
      image: data.secure_url,
    }));
  };
  const inputshandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewfoods((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFood = () => {
    const dataToSend = {
      ...newfoods,
      category: id,
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food`, dataToSend)
      .then((response) => {
        console.log("✅ Success:", response.data.message);
        toast.custom((t) => (
          <div
            className={`w-[400px] top-[-20%] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all`}>
            <Check className="size-4 text-white" />
            <span className="text-[16px] font-medium text-[#FAFAFA]">
              New dish is being added to the menu
            </span>
          </div>
        ));

        setTimeout(function () {
          window.location.reload();
        }, 1000);
      })

      .catch((error) => {
        console.error(
          "❌ Error:",
          error.response?.data?.message || error.message
        );
        alert(error.response?.data?.message || "Something went wrong.");
      });
  };

  const on = () => {
    setInputval("");
  };

  return (
    <div className="flex w-[460px] p-6 flex-col items-start gap-6 rounded-xl bg-white text-[#09090B]">
      <div className="flex items-start gap-6">
        <div className="flex h-[60px] flex-col items-start gap-2">
          <label className="flex items-start text-[14px] font-medium">
            Food name
          </label>
          <input
            onChange={inputshandler}
            name="name"
            placeholder="Type food name"
            className="flex py-2 px-4 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white shadow-sm"></input>
        </div>
        <div className="flex h-[60px] flex-col items-start gap-2">
          <label className="flex items-start text-[14px] font-medium">
            Food price
          </label>
          <input
            type="number"
            onChange={inputshandler}
            name="price"
            placeholder="Enter price..."
            className="flex no-spinner  py-2 px-4 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white shadow-sm"></input>
        </div>
      </div>
      <div className="flex h-[112px] flex-col items-start gap-2">
        <label className="flex text-start items-start text-[14px] font-medium">
          Ingredients
        </label>
        <textarea
          onChange={inputshandler}
          name="ingredients"
          placeholder="List ingredients..."
          className="flex w-[412px] h-[90px] resize-none  py-2 px-4 items-start self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white shadow-sm"></textarea>
      </div>
      <div className="flex h-[160px] flex-col items-start gap-2">
        <label className="flex items-start text-[14px] font-medium">
          Food image
        </label>

        <input
          onChange={imagehandler}
          type="file"
          className="flex cursor-pointer  w-[412px] h-[138px] text-transparent p-4 flex-col justiify-center rounded-md border-[1px] border-[#2563eb33] bg-[#2563eb0d] hover:bg-[#c0d3ff0d] items-center gap-2 absolute left-[30px] bottom-[130px] z-10"></input>

        <div className="cursor-pointer flex w-[412px] h-[138px] p-4 flex-col justiify-center rounded-md border-[1px] border-[#2563eb33] border-dashed bg-[#2563eb0d] items-center gap-2 absolute left-[30px] bottom-[130px] z-0">
          <Image className="mt-4" />
          <p className="text-[#18181B] text-[14px]">
            Choose a file or drag & drop it here
          </p>
        </div>

        {inputval !== "" && (
          <div
            className=" w-[412px] h-[138px] rounded-md absolute z-50 left-[30px] bottom-[130px]"
            style={{
              backgroundImage: `url(${inputval})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <motion.div
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer absolute right-2">
              <div className="cursor-pointer flex size-9 justify-center items-center gap-2 absolute right-[8px] top-[10px] rounded-full border-[1px] border-[#E4E4E7]  bg-white hover:bg-black text-black hover:text-white">
                <X className=" size-4" onClick={on} />
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-end pt-6 items-center self-stretch">
        <div className="flex cursor-pointer items-center gap-2">
          <DialogClose asChild>
            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer">
              <button
                onClick={addFood}
                className="flex cursor-pointer h-10 py-2 px-4 justify-center items-center gap-2 rounded-md bg-[#18181B] text-white text-[14px] font-medium">
                <p>Add Dish</p>
              </button>
            </motion.div>
          </DialogClose>
        </div>
      </div>
    </div>
  );
};
