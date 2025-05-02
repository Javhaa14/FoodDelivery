"use client";
import axios from "axios";
import { Plus } from "lucide-react";
import { Pen } from "lucide-react";
import { Trash } from "lucide-react";
import { X } from "lucide-react";
import { Image } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { AddNewfood } from "./Addnewfood";
import { UndoToast } from "./Toast";

type Food = {
  _id: string;
  name: string;
  ingredients: string;
  image: string;
  price: number;
  category: {
    _id: string;
    categoryName: string;
  }[];
};
type DishInputs = {
  dishname: string;
  dishcategory: string;
  ingredients: string;
  price: number;
  image: string;
};

type Category = {
  _id: string;
  categoryName: string;
};
export const List = ({
  categoryname,
  id,
}: {
  categoryname: string;
  id: string;
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [foods, setFoods] = useState<Food[]>([]);
  const [inputval, setInputval] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [clicked, setClicked] = useState(false);
  const [changedcat, setChangedcat] = useState<string>("");
  const [otherinputs, setOtherinputs] = useState<DishInputs>({
    dishname: "",
    dishcategory: "",
    ingredients: "",
    price: 0,
    image: "",
  });
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [tempDeletedFood, setTempDeletedFood] = useState<Food | null>(null);
  let undoTimer: NodeJS.Timeout;

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
  const fetchFoods = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/category/${id}`
    );
    setFoods(res.data);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [id]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const fieldMap: Record<string, string> = {
      "Dish name": "dishname",
      Ingredients: "ingredients",
      Price: "price",
    };
    const field = fieldMap[name];
    if (field) {
      setOtherinputs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const onclick = (n: Food) => {
    setInputval(n.image);
    setChangedcat(n.category[0].categoryName);
    setOtherinputs({
      dishname: n.name,
      dishcategory: n.category[0]._id,
      ingredients: n.ingredients,
      price: n.price,
      image: n.image,
    });
  };

  const inputs = [
    {
      name: "Dish name",
      type: "text",
      height: "h-[60px]",
      class:
        "flex w-[288px] py-2 px-4 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white ",
      value: otherinputs.dishname,
    },
    {
      name: "Dish category",
      type: "text",
      height: "h-[60px]",
      class:
        "hidden w-[288px] py-2 px-4 items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white ",
      value: otherinputs.dishcategory,
    },
    {
      name: "Ingredients",
      type: "text",
      height: "h-[104px]",
      class:
        "flex w-[288px] py-2 px-4  resize-none items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white ",
      value: otherinputs.ingredients,
    },
    {
      name: "Price",
      type: "number",
      height: "h-[60px]",
      class:
        "flex w-[288px] py-2 px-4 no-spinner items-center self-stretch rounded-md border-[1px] border-[#E4E4E7] bg-white ",
      value: otherinputs.price,
    },
    {
      name: "Image",
      type: "file",
      height: "h-[150px]",
      class: "flex w-[288px] h-[138px] text-transparent cursor-pointer",
      value: "",
    },
  ];

  const on = () => {
    setInputval("");
  };

  const click = () => {
    setClicked(!clicked);
  };

  const catchoice = (i: string, b: string) => {
    setChangedcat(i);
    setClicked(false);
    setOtherinputs((prev) => ({
      ...prev,
      dishcategory: b,
    }));
  };
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

    setInputval(data.secure_url);
    console.log("Uploaded image URL:", data.secure_url);
    setOtherinputs((prev) => ({
      ...prev,
      image: data.secure_url,
    }));
  };
  const updateFood = (id: string) => {
    axios
      .put(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/${id}`, {
        name: otherinputs.dishname,
        category: otherinputs.dishcategory,
        ingredients: otherinputs.ingredients,
        price: Number(otherinputs.price),
        image: otherinputs.image,
      })
      .then((response) => {
        console.log("✅ Success:", response.data.message);
        fetchFoods();
        window.location.reload();
      })
      .catch((error) => {
        console.error(
          "❌ Error:",
          error.response?.data?.message || error.message
        );
        alert(error.response?.data?.message || "Something went wrong.");
      });
  };
  const deleteFood = (id: string) => {
    const foodToDelete = foods.find((f) => f._id === id);
    if (!foodToDelete) return;

    setTempDeletedFood(foodToDelete);
    setFoods((prev) => prev.filter((f) => f._id !== id));
    setShowUndoToast(true);

    undoTimer = setTimeout(() => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/food/${id}`)
        .then((res) => {
          console.log("✅ Deleted:", res.data.message);
          setTempDeletedFood(null);
          setShowUndoToast(false);
        })
        .catch((err) => {
          console.error("❌ Delete failed:", err);
        });
    }, 5000);
  };
  const handleUndoDelete = () => {
    if (tempDeletedFood) {
      setFoods((prev) => [...prev, tempDeletedFood]);
      setTempDeletedFood(null);
      setShowUndoToast(false);
      clearTimeout(undoTimer);
      console.log("🧹 Undo successful");
    }
  };

  return (
    <div className="flex w-[1180px] p-5 h-fit flex-col items-start gap-4 self-stretch rounded-xl bg-white">
      <UndoToast
        show={showUndoToast}
        message1={`Dish "${tempDeletedFood?.name}" successfully deleted.`}
        message2={" Would you like to undo this action?"}
        onUndo={handleUndoDelete}
        onTimeout={() => {
          setShowUndoToast(false);
          setTempDeletedFood(null);
        }}
      />

      <div className="flex items-center text-[#09090B]">
        <p className="text-[20px] font-semibold">{categoryname}</p>
        <p className="text-[20px] font-semibold">({foods.length})</p>
      </div>
      <div className="flex flex-wrap h-fit items-start gap-4 self-stretch">
        <Dialog>
          <DialogTrigger>
            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer">
              <div className="flex w-[271px] h-[241px] py-2 px-4 flex-col justify-center items-center gap-6 self-stretch rounded-[20px] border-[1px] border-[#EF4444] border-dashed">
                <div className="cursor-pointer flex size-10 justify-center items-center gap-2 rounded-full bg-[#EF4444] hover:bg-black">
                  <Plus />
                </div>
                <p className="text-[#09090B] w-[154px] text-[14px] font-medium flex text-center">
                  Add new Dish to Appetizers
                </p>
              </div>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="flex flex-col w-[472px] h-[596px] justify-center items-center self-stretch gap-[1px]">
            <DialogTitle className="flex w-[472px] justify-start pl-6 absolute top-6">
              <p className="text-[#09090B] text-[18px] font-semibold">
                Add new Dish to "{categoryname}"
              </p>
            </DialogTitle>
            <AddNewfood id={id} />
          </DialogContent>
        </Dialog>

        {foods.map((el) => {
          return (
            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              key={el._id}>
              <Dialog>
                <DialogTrigger className="cursor-pointer">
                  <div
                    onClick={() => {
                      onclick(el);
                    }}
                    className="flex p-4 w-[271px] h-[255px] overflow-hidden flex-col items-start gap-5 self-stretch rounded-[20px] border-[1px] border-[#E4E4E7]">
                    <img
                      className="flex h-[129px] w-[238px] justify-end items-end gap-[10px] rounded-xl relative"
                      src={`${el.image}`}></img>

                    <div className="absolute ml-[180px] mt-[80px] cursor-pointer flex size-11 justify-center items-center gap-2 rounded-full bg-white hover:bg-black text-red-500 hover:text-white">
                      <Pen className=" size-4" />
                    </div>

                    <div className="flex flex-col items-start gap-2 self-stretch">
                      <div className="flex justify-between items-center gap-[10px] self-stretch">
                        <p className="text-[14px] text-[#EF4444] font-medium">
                          {el.name}
                        </p>
                        <p className="text-[12px] text-[#09090B]">{el.price}</p>
                      </div>
                      <p className="text-[12px] text-[#09090B]">
                        {el.ingredients}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="flex flex-col w-[472px] h-[596px] justify-center items-center self-stretch gap-[1px]">
                  <DialogTitle className="flex w-[472px] justify-start pl-6 absolute top-6">
                    <p className="text-[#09090B] text-[18px] font-semibold">
                      Dishes info
                    </p>
                  </DialogTitle>
                  {inputs.map((value, index) => {
                    return (
                      <div key={index} className="flex w-[472px] justify-start">
                        <div className="flex w-full flex-col text-black items-start self-stretch px-6">
                          <div
                            className={`flex py-3 w-full justify-between items-start self-stretch relative ${value.height}`}>
                            <p className="text-[#71717A] text-[12px]">
                              {value.name}
                            </p>
                            {index !== 2 ? (
                              <input
                                onChange={
                                  index === 4 ? imagehandler : handleInputChange
                                }
                                name={value.name}
                                type={value.type}
                                className={`${value.class}`}
                                value={value.value}
                              />
                            ) : (
                              <textarea
                                name={value.name}
                                value={value.value}
                                className={`${value.class}`}
                                onChange={handleInputChange}></textarea>
                            )}

                            {index === 1 && (
                              <div className="flex w-[288px] h-9 py-2 px-4 justify-between items-center rounded-md border-[1px] border-[#e4e4e7] bg-white shadow-sm font-semibold">
                                <div className="flex w-[116px] py-[2px] px-[10px] items-start gap-[10px] rounded-full bg-[#F4F4F5]">
                                  <p className="text-[#424262] text-[12px] cursor-pointer">
                                    {changedcat}
                                  </p>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="cursor-pointer absolute ml-[230px]">
                                  <ChevronDown
                                    className={`${
                                      clicked ? "hidden" : "flex"
                                    } cursor-pointer hover:text-red-500`}
                                    onClick={click}
                                  />
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="cursor-pointer absolute  ml-[230px]">
                                  <ChevronUp
                                    className={`${
                                      clicked ? "flex" : "hidden"
                                    } cursor-pointer hover:text-red-500`}
                                    onClick={click}
                                  />
                                </motion.div>

                                <div
                                  className={`${
                                    clicked
                                      ? "max-h-[300px] opacity-100"
                                      : "max-h-0 opacity-0"
                                  } transition-all duration-300 ease-in-out overflow-scroll h-[396px] flex-col items-start rounded-md bg-white shadow-sm absolute z-50 top-[90%] left-[32%] p-4`}>
                                  {categories.map((val: Category) => {
                                    return (
                                      <motion.div
                                        whileHover={{ scale: 1.07 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="cursor-pointer"
                                        key={val._id}>
                                        <div
                                          onClick={() => {
                                            catchoice(
                                              val.categoryName,
                                              val._id
                                            );
                                          }}
                                          className="cursor-pointer flex w-[116px] py-[2px] px-[10px] items-start gap-[10px] rounded-full bg-[#F4F4F5] hover:bg-black text-[#424262] hover:text-white mt-4">
                                          <p className=" text-[12px]">
                                            {val.categoryName}
                                          </p>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {index == 4 && (
                              <div className="cursor-pointer flex w-[288px] h-[138px] p-4 flex-col justiify-center rounded-md border-[1px] border-[#2563eb33] bg-[#2563eb0d] hover:bg-[#c0d3ff0d] items-center gap-2 absolute z-[-1] left-[135px]">
                                <Image className="mt-4" />
                                <p className="text-[#18181B] text-[14px]">
                                  Choose a file or drag & drop it here
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {inputval !== "" && (
                    <div
                      className="w-[288px] h-[137px] rounded-md absolute ml-[134px] mt-[235px]"
                      style={{
                        backgroundImage: `url(${inputval})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}>
                      <motion.div
                        whileHover={{ scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer absolute right-2">
                        <div className="cursor-pointer flex size-9 justify-center items-center gap-2 absolute right-[8px] top-[10px] rounded-full border-[1px] border-[#E4E4E7] bg-white hover:bg-black text-black hover:text-white">
                          <X className=" size-4" onClick={on} />
                        </div>
                      </motion.div>
                    </div>
                  )}
                  <div className="flex w-full justify-between pt-6 items-center self-stretch">
                    <motion.div
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer">
                      <div
                        onClick={() => {
                          deleteFood(el._id);
                        }}
                        className="flex cursor-pointer h-10 py-2 px-4 justify-center items-center gap-2 rounded-md border-[1px] border-[#ef444480] bg-white">
                        <Trash className="text-[#ef444480] size-4" />
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer">
                      <div
                        onClick={() => {
                          updateFood(el._id);
                        }}
                        className="flex cursor-pointer h-10 py-2 px-4 justify-center items-center gap-2 rounded-md bg-[#18181B] text-white text-[14px] font-medium">
                        Save Changes
                      </div>
                    </motion.div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
