"use client";
import { CalendarDays } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { Order } from "../components/Order";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Check } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
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
export default function Home() {
  const [orders, setOrders] = useState<Orders[]>([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order`)
      .then((res) => setOrders(res.data));
  }, []);
  console.log(orders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, id]);
    } else {
      setSelectedOrders((prev) => prev.filter((orderId) => orderId !== id));
    }
  };
  const state = [
    {
      status: "Pending",
    },
    {
      status: "Cancelled",
    },
    {
      status: "Delivered",
    },
  ];
  const handlestatus = async () => {
    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order/${orderId}`,
            {
              status: selectedStatus,
            }
          )
        )
      );
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/order`
      );
      setOrders(res.data);
      setSelectedOrders([]);
      toast.custom((t) => (
        <div
          className={`w-[300px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}
        >
          <Check className="size-4 text-white" />
          <span className="text-[16px] font-medium text-center text-[#FAFAFA]">
            Хүргэлтийн төлөв амжилттай өөрчлөгдсөн!
          </span>
        </div>
      ));
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };
  const handlecheck = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((val) => val._id));
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="flex w-full max-w-[1171px] h-[1024px] overflow-hidden flex-col items-end gap-6 p-6 ml-[204px] bg-[#f4f4f5cc]">
      <div className="flex w-full max-w-[1171px] h-[948px] flex-col items-end gap-6">
        <div className="flex w-full justify-end gap-2">
          <img src="globe.svg" className="size-[36px] rounded-full"></img>
        </div>
        <div className="flex w-full flex-col items-start rounded-lg border border-[#E4E4E7] bg-white p-4 shadow-sm ">
          <div className="flex p-4 justify-between items-center self-stretch border-b-[1px] border-b-[#E4E4E7]">
            <div className="flex w-[485px] flex-col items-start">
              <p className="text-[#09090B] text-[20px] font-bold">Захиалгууд</p>
              <p className="text-[12px] text-[#71717A]">
                {orders.length}ш захиалга
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start gap-2">
                <div className="flex w-[300px] py-2 px-4 justify-between items-center rounded-full border-[1px] border-[#E4E4E7] bg-white">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-[#09090B]" />
                    <p className="text-[#09090B] text-[14px]">
                      13 June 2025 - 14 July 2023
                    </p>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    disabled={selectedOrders.length === 0}
                    onClick={(e) => {
                      if (selectedOrders.length === 0) e.preventDefault();
                    }}
                    className={`cursor-pointer flex h-[36px] py-2 px-4 justify-center items-center gap-2 rounded-full transition-all ${
                      selectedOrders.length === 0
                        ? "bg-[#18181B]/20 text-white cursor-not-allowed"
                        : "bg-[#18181B] text-white hover:bg-[#2c2c2e]"
                    }`}
                  >
                    Change delivery state
                    {selectedOrders.length > 0 && (
                      <div className="flex py-[2px] px-[10px] items-start gap-[10px] rounded-full bg-white text-black">
                        {selectedOrders.length}
                      </div>
                    )}
                  </button>
                </DialogTrigger>

                <DialogContent className="flex flex-col p-6 w-[364px] h-[200px] items-start self-stretch gap-[24px] rounded-xl bg-white">
                  <DialogTitle className="text-[#09090B] text-center text-[14px] font-medium">
                    Change delivery state
                  </DialogTitle>
                  <div className="w-full flex flex-col gap-6">
                    <div className="flex items-start gap-4 ">
                      {state.map((v, i) => {
                        return (
                          <div
                            key={i}
                            className={`w-[95px] h-[32px] cursor-pointer flex py-2 px-[10px] justify-center items-center gap-[10px] rounded-full transition-all ${
                              selectedStatus === v.status
                                ? "border-[1px] text-[#EF4444] bg-[#e11d481a] border-[#EF4444]"
                                : "text-[#18181B] bg-[#F4F4F5] border-[0px]"
                            }`}
                            onClick={() => setSelectedStatus(v.status)}
                          >
                            {v.status}
                          </div>
                        );
                      })}
                    </div>
                    <DialogClose>
                      <div
                        onClick={handlestatus}
                        className="cursor-pointer flex justify-center items-center gap-4 h-[36px] px-3 py-2 w-full rounded-full bg-[#18181B] text-[#FAFAFA]"
                      >
                        Save
                      </div>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex items-start self-stretch bg-[#f4f4f5cc]">
            <div className="flex p-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <input
                checked={
                  selectedOrders.length === orders.length && orders.length > 0
                }
                onChange={handlecheck}
                type="checkbox"
                className="accent-[#09090B] cursor-pointer rounded-sm focus:ring-[#18181B]"
              ></input>
            </div>
            <div className="flex p-4 w-[56px] items-center gap-[10px] border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#09090B] text-[14px]">№</p>
            </div>
            <div className="flex w-[214px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Customer</p>{" "}
            </div>
            <div className="flex w-[160px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Food</p>{" "}
            </div>
            <div className="flex w-[160px] px-4 justify-between items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Date</p>{" "}
              <ChevronsUpDown className="text-[#09090B] size-4" />
            </div>
            <div className="flex w-[130px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Total</p>{" "}
            </div>
            <div className="flex w-[244px] px-4 items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Deliveriy Address</p>{" "}
            </div>
            <div className="flex w-[160px] px-4 justify-between items-center gap-[10px] self-stretch border-b-[1px] border-b-[#E4E4E7]">
              <p className="text-[#71717A] text-[14px]">Delivery state</p>{" "}
              <ChevronsUpDown className="text-[#09090B] size-4" />
            </div>
          </div>
          <div className="flex flex-col h-fit items-start self-stretch ">
            {orders
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((val, index) => (
                <Order
                  key={val._id}
                  no={(currentPage - 1) * itemsPerPage + index + 1}
                  customer={val.user ? val.user.email : "User deleted"}
                  food={val.foodorderitems.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}
                  date={val.createdAt}
                  total={val.totalPrice}
                  address={val.user?.address || "No address"}
                  state={val.status}
                  foodorderitem={val.foodorderitems}
                  isChecked={selectedOrders.includes(val._id)}
                  onCheckChange={(checked: boolean) =>
                    handleCheckboxChange(val._id, checked)
                  }
                />
              ))}
          </div>
        </div>
        <Toaster position="top-center" />
        <div className="flex px-2 justify-end items-center self-stretch">
          <div className="flex items-center gap-6 h-[32px] w-fit">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`cursor-pointer flex items-center justify-center p-1 rounded-full ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="text-black " />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`cursor-pointer w-[32px] h-[32px] rounded-full text-sm flex items-center justify-center ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "bg-white text-black border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`cursor-pointer flex items-center justify-center p-1 rounded-full ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <ChevronRight className="text-black " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
