"use client";
import Cookies from "js-cookie";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";

import { Check, MapPin, Search } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Order } from "./Order";

import { Dropmail } from "./Dropmail";
import axios from "axios";
import { CartSheet } from "./Cartsheet";

type Order = {
  foodId: string;
  price: number;
  quantity: number;
};
type Orders = {
  _id: string;
  user: {
    _id: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    isVerified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  totalPrice: number;
  foodorderitems: {
    food: {
      _id: string;
      name: string;
      ingredients: string;
      image: string;
      price: number;
      category: string[];
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    price: number;
    quantity: number;
    _id: string;
  }[];
  status: "Pending" | "Delivered" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const Sh = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState(false);
  const [checked, setChecked] = useState<Orders[]>([]);
  const [email, setEmail] = useState("");
  const textchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order/byid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setChecked(res.data));

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/byid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data, "add");

        setInput(res.data.address);
        setAddress(res.data.address);
        setEmail(res.data.email);
      });
  }, []);
  useEffect(() => {
    const count = parseInt(localStorage.getItem("cartCount") || "0", 10);
    setCartCount(count);

    const handleCartUpdate = () => {
      const newCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
      setCartCount(newCount);

      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    };

    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);
  const handleCheckoutClick = async () => {
    setSheetOpen(false);
    const transformedOrders = orders.map((order) => ({
      food: order.foodId,
      price: order.price,
      quantity: Number(order.quantity),
    }));

    if (transformedOrders.length === 0) {
      toast.custom(() => (
        <div
          className={`w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}
        >
          <X className="size-4 text-white" />
          <span className="text-[16px] font-medium text-center text-[#FAFAFA]">
            Таны сагс хоосон байна!
          </span>
        </div>
      ));
      return;
    }

    if (input === "") {
      setDialogOpen1(true);
      return;
    }

    setDialogOpen2(true);

    const total = transformedOrders.reduce(
      (acc, order) => acc + order.price * order.quantity,
      0
    );
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order`,
        {
          foodorderitems: transformedOrders,
          totalPrice: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order/byid`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const validatedData = res.data.map((order: Orders) => ({
        ...order,
        foodorderitems: order.foodorderitems || [],
      }));

      setChecked(validatedData);
      setOrders([]);
      setCartCount(0);
      localStorage.removeItem("cartCount");
      localStorage.removeItem("orders");
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Order failed. Please try again.");
    }
  };
  const o = () => {
    setInput("");
  };
  const s = () => {
    setSearch(!search);
  };
  const z = async () => {
    setInput(address);

    try {
      if (address.length > 0) {
        const token = localStorage.getItem("token");

        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user`,
          {
            address: address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.custom(() => (
          <div
            className={`w-[300px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}
          >
            <Check className="size-4 text-white" />
            <span className="text-[16px] font-medium text-center text-[#FAFAFA]">
              Хүргэлтийн хаяг амжилттай бүртгэгдлээ!
            </span>
          </div>
        ));
      } else {
        toast.custom(() => (
          <div
            className={`w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}
          >
            <X className="size-4 text-white" />
            <span className="text-[16px] font-medium text-center text-[#FAFAFA]">
              Хүргэлтийн хаягаа оруулна уу?
            </span>
          </div>
        ));
      }
    } catch (error) {
      console.error("Address did not updated:", error);
    }
  };
  const signout = () => {
    Cookies.set("Loggedin", "false", { expires: 365 });
    localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
    if (dialogOpen2) {
      const timer = setTimeout(() => {
        setDialogOpen2(false);
      }, 3900);

      return () => clearTimeout(timer);
    }
  }, [dialogOpen2]);
  return (
    <div className="flex items-center gap-3">
      <Dialog>
        <DialogTrigger>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer w-full"
          >
            <div className="w-[251px] h-[36px] cursor-pointer flex py-2 px-3 justify-center items-center gap-1 rounded-full bg-white">
              <MapPin className="text-[#EF4444] size-5" />

              {input == "" ? (
                <div className="flex w-[200px] justify-center items-center gap-2 relative">
                  <p className="text-[#EF4444] text-[12px]">
                    Delivery address:
                  </p>
                  <p className="text-[#71717A] text-[12px]">Add Location</p>
                  <ChevronRight className="text-[#71717A] size-5" />
                </div>
              ) : (
                <div className="flex  w-[200px] text-black items-center">
                  <input
                    value={input}
                    onChange={textchange}
                    className="cursor-pointer w-full focus:outline-none focus:ring-0 focus:border-transparent"
                  />
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    <X
                      onClick={o}
                      className="text-[#71717A] hover:text-red-500 size-5"
                    />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </DialogTrigger>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
        >
          <Search
            onClick={s}
            className="text-white hover:text-red-500 size-5"
          />
        </motion.div>
        {search && (
          <div className="text-black flex absolute top-4 w-[251px] h-[36px] cursor-pointer py-2 px-3 justify-center items-center gap-1 rounded-full bg-white">
            <MapPin className="text-[#EF4444] size-5" />
            <input
              // value={input}
              // onChange={textchange}
              className="cursor-pointer w-full focus:outline-none focus:ring-0 focus:border-transparent"
            />
          </div>
        )}

        <DialogContent className="flex flex-col p-6 w-[480px] h-[308px] justify-center items-start self-stretch gap-[24px] rounded-xl bg-white">
          <DialogTitle className="flex w-full justify-start absolute top-5 text-[#09090B] text-[18px] font-semibold">
            Delivery address
          </DialogTitle>
          <div className="flex mt-10 flex-col h-[112px] items-start gap-2 self-stretch text-[#09090B] text-start">
            <textarea
              value={address}
              onChange={textchange}
              placeholder="Барилгын дугаар, орц, орон сууцны дугаар зэрэг тодорхой хаягийн мэдээллийг оруулна уу"
              className="focus:outline-none focus:ring-0 focus:border-transparent w-[432px] h-[112px] p-3 rounded-md border border-[#E4E4E7] shadow-sm resize-none text-start align-top"
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <DialogClose asChild>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <button className="cursor-pointer flex h-10 py-2 px-4 justify-center items-center rounded-md border-[1px] border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#dfdfdf]">
                  Cancel
                </button>
              </motion.div>
            </DialogClose>
            <DialogClose asChild>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <button
                  onClick={z}
                  className=" cursor-pointer ml-4 flex h-10 py-2 px-4 justify-center items-center rounded-md border-[1px] border-[#E4E4E7] bg-[#18181B] text-white hover:bg-[#4a4a4a]"
                >
                  Deliver Here
                </button>
              </motion.div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="flex flex-col p-6 w-[480px] h-[228px] justify-center items-center self-stretch gap-[24px] rounded-xl bg-white">
          <DialogTitle></DialogTitle>
          <p className="flex w-full text-[#09090B] text-center text-[18px] font-semibold pl-20">
            Хүргэлтийн хаягаа оруулна уу?{" "}
          </p>
          <img src="q.png" className="size-[150px]" alt="" />
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen2} onOpenChange={setDialogOpen2}>
        <DialogTrigger></DialogTrigger>
        <DialogContent
          className="flex flex-col p-6 w-[480px] h-[228px] justify-center items-center self-stretch gap-[24px] rounded-xl bg-white"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="text-[#09090B] text-center text-[18px] font-semibold">
            Таны захиалга амжилттай!
          </DialogTitle>
          <p className="flex w-fit text-[#09090B] text-center text-[15px] mb-20">
            Та хоолоо иртэл түр хүлээнэ үү!
          </p>
          <img
            className="size-20 animate-ride absolute top-30 left-20"
            src="boy.avif"
            alt="Delivery boy"
          />
        </DialogContent>
      </Dialog>
      <CartSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        orders={orders}
        checked={checked}
        input={input}
        handleCheckoutClick={handleCheckoutClick}
      />
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer w-full"
      >
        <div className="relative group h-[35px]">
          <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#EF4444] hover:bg-[#000000] text-white ">
            <User className="size-4" />
          </div>
          <div className="hidden group-hover:flex">
            <Dropmail mail={email} onclick={signout} />
          </div>
        </div>
      </motion.div>

      {cartCount > 0 && (
        <motion.div
          key={cartCount}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, -10, 10, 0],
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-2 right-37 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold z-50"
        >
          {cartCount}
        </motion.div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};
