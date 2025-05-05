"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, ChevronRight, MapPin, User, X } from "lucide-react";
import { Toaster, toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Dropmail } from "./Dropmail";
import { Order } from "./Order";
import { CartSheet } from "./Cartsheet";

type CheckedOrder = {
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

type Order = {
  foodId: string;
  price: number;
  quantity: number;
};

export const Sh = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState<CheckedOrder[]>([]);
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order/byid`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChecked(res.data));

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user/byid`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInput(res.data.address);
        setAddress(res.data.address);
        setEmail(res.data.email);
      });
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const newCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
      setCartCount(newCount);
      const storedOrders = localStorage.getItem("orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  const handleCheckoutClick = async () => {
    setSheetOpen(false);

    const transformedOrders = orders.map((order) => ({
      food: order.foodId,
      price: order.price,
      quantity: order.quantity,
    }));

    if (transformedOrders.length === 0) {
      toast.custom(() => (
        <ToastMessage icon={<X />} message="Таны сагс хоосон байна!" />
      ));
      return;
    }

    if (input === "") {
      setDialogOpen1(true);
      return;
    }

    setDialogOpen2(true);

    const total = transformedOrders.reduce(
      (acc, o) => acc + o.price * o.quantity,
      0
    );

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order`,
        {
          foodorderitems: transformedOrders,
          totalPrice: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order/byid`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChecked(res.data);
      setOrders([]);
      setCartCount(0);
      localStorage.removeItem("orders");
      localStorage.removeItem("cartCount");
    } catch (error) {
      toast.error("Order failed. Please try again.");
    }
  };

  const clearInput = () => setInput("");

  const updateAddress = async () => {
    if (!address.trim()) {
      toast.custom(() => (
        <ToastMessage icon={<X />} message="Хүргэлтийн хаягаа оруулна уу?" />
      ));
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/user`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.custom(() => (
        <ToastMessage icon={<Check />} message="Хаяг амжилттай шинэчлэгдлээ!" />
      ));
    } catch (error) {
      console.error("Address update failed:", error);
    }
  };

  const signout = () => {
    Cookies.set("Loggedin", "false", { expires: 365 });
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    if (dialogOpen2) {
      const timer = setTimeout(() => setDialogOpen2(false), 3900);
      return () => clearTimeout(timer);
    }
  }, [dialogOpen2]);

  return (
    <div className="flex items-center gap-3">
      {/* Delivery Address Input */}
      <Dialog>
        <DialogTrigger>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer">
            <div className="w-[251px] h-[36px] flex py-2 px-3 justify-center items-center gap-1 rounded-full bg-white">
              <MapPin className="text-[#EF4444] size-5" />
              {input ? (
                <div className="flex w-[200px] items-center">
                  <input
                    value={input}
                    onChange={handleAddressChange}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  <X
                    onClick={clearInput}
                    className="text-[#71717A] hover:text-red-500 size-5 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex w-[200px] items-center gap-2">
                  <p className="text-[#EF4444] text-[12px]">
                    Delivery address:
                  </p>
                  <p className="text-[#71717A] text-[12px]">Add Location</p>
                  <ChevronRight className="text-[#71717A] size-5" />
                </div>
              )}
            </div>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="w-[480px] h-[308px] p-6 bg-white rounded-xl">
          <DialogTitle className="text-[#09090B] text-[18px] font-semibold">
            Delivery address
          </DialogTitle>
          <textarea
            value={address}
            onChange={handleAddressChange}
            placeholder="Орц, байр, өрөөний дугаар..."
            className="mt-6 w-full h-[112px] p-3 border border-[#E4E4E7] rounded-md resize-none"
          />
          <div className="flex justify-between mt-6">
            <DialogClose asChild>
              <button className="px-4 py-2 border border-[#E4E4E7] rounded-md">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={updateAddress}
                className="px-4 py-2 bg-[#18181B] text-white rounded-md">
                Deliver Here
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty Address Warning Dialog */}
      <Dialog open={dialogOpen1} onOpenChange={setDialogOpen1}>
        <DialogTrigger />
        <DialogContent className="w-[480px] h-[228px] p-6 bg-white flex flex-col items-center rounded-xl">
          <p className="text-[#09090B] text-[18px] font-semibold text-center">
            Хүргэлтийн хаягаа оруулна уу?
          </p>
          <img src="q.png" className="size-[150px]" alt="warning" />
        </DialogContent>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog open={dialogOpen2} onOpenChange={setDialogOpen2}>
        <DialogTrigger />
        <DialogContent
          className="w-[480px] h-[228px] p-6 bg-white flex flex-col items-center rounded-xl relative"
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogTitle className="text-[#09090B] text-[18px] font-semibold text-center">
            Таны захиалга амжилттай!
          </DialogTitle>
          <p className="text-[#09090B] text-[15px] text-center mb-20">
            Та хоолоо иртэл түр хүлээнэ үү!
          </p>
          <img
            src="boy.avif"
            alt="Delivery"
            className="size-20 absolute top-28 left-20 animate-ride"
          />
        </DialogContent>
      </Dialog>

      {/* Cart Sheet */}
      <CartSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        orders={orders}
        checked={checked}
        input={input}
        handleCheckoutClick={handleCheckoutClick}
      />

      {/* User Avatar and Email Dropdown */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="relative group">
        <div className="flex size-9 justify-center items-center bg-[#EF4444] text-white rounded-full">
          <User className="size-4" />
        </div>
        <div className="hidden group-hover:flex">
          <Dropmail mail={email} onclick={signout} />
        </div>
      </motion.div>

      {/* Cart Count Badge */}
      {cartCount > 0 && (
        <motion.div
          key={cartCount}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0], opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-2 right-37 w-5 h-5 flex justify-center items-center bg-red-500 text-white text-xs font-bold rounded-full z-50">
          {cartCount}
        </motion.div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

const ToastMessage = ({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) => (
  <div className="p-4 w-fit rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 border border-white">
    {icon}
    <span className="text-[16px] font-medium text-[#FAFAFA]">{message}</span>
  </div>
);
