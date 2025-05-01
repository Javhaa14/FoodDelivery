"use client";
import Cookies from "js-cookie";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, MapPin } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Cartempty } from "./Cartempty";
import { Order } from "./Order";
import { Checkout } from "./Checkout";
import { Userorder } from "./Userorder";
import { Dropmail } from "./Dropmail";
import axios from "axios";
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
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
type Order = {
  foodId: string;
  price: number;
  quantity: number;
};
export const Shee = ({}: {}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");

  const [checked, setChecked] = useState<CheckedOrder[]>([]);
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
      toast.custom((t) => (
        <div
          className={`w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}>
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

      const validatedData = res.data.map((order: any) => ({
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
        toast.custom((t) => (
          <div
            className={`w-[300px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}>
            <Check className="size-4 text-white" />
            <span className="text-[16px] font-medium text-center text-[#FAFAFA]">
              Хүргэлтийн хаяг амжилттай бүртгэгдлээ!
            </span>
          </div>
        ));
      } else {
        toast.custom((t) => (
          <div
            className={`w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-2 transition-all border-[1px] border-white`}>
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
  return (
    <div className="flex items-center gap-3">
      <Dialog>
        <DialogTrigger>
          <div className="w-[251px] h-[36px] cursor-pointer flex py-2 px-3 justify-center items-center gap-1 rounded-full bg-white">
            <MapPin className="text-[#EF4444] size-5" />
            {input !== "" ? (
              <div className="flex  w-[200px] text-black items-center">
                <input
                  value={input}
                  onChange={textchange}
                  className="cursor-pointer w-full focus:outline-none focus:ring-0 focus:border-transparent"
                />
                <X onClick={o} className="text-[#71717A] size-5" />
              </div>
            ) : (
              <div className="flex w-[200px] justify-center items-center gap-2">
                <p className="text-[#EF4444] text-[12px]">Delivery address:</p>
                <p className="text-[#71717A] text-[12px]">Add Location</p>
                <ChevronRight className="text-[#71717A] size-5" />
              </div>
            )}
          </div>
        </DialogTrigger>
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
          <div className="flex justify-end items-center w-full">
            <DialogClose asChild>
              <button className="cursor-pointer flex h-10 py-2 px-4 justify-center items-center rounded-md border-[1px] border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#dfdfdf]">
                Cancel
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={z}
                className=" cursor-pointer ml-4 flex h-10 py-2 px-4 justify-center items-center rounded-md border-[1px] border-[#E4E4E7] bg-[#18181B] text-white hover:bg-[#4a4a4a]">
                Deliver Here
              </button>
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
        <DialogContent className="flex flex-col p-6 w-[480px] h-[228px] justify-center items-center self-stretch gap-[24px] rounded-xl bg-white">
          <DialogTitle className="text-[#09090B] text-center text-[18px] font-semibold">
            Таны захиалга амжилттай!
          </DialogTitle>
          <p className="flex w-fit text-[#09090B] text-center text-[15px] mb-20">
            Та хоолоо иртэл түр хүлээнэ үү!
          </p>
          <img
            className="size-20 animate-ride absolute top-30 left-20"
            src="boy.avif"
            alt=""
          />
        </DialogContent>
      </Dialog>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#F4F4F5] hover:bg-black text-black hover:text-white">
            <ShoppingCart className=" size-4" />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#404040] overflow-scroll flex w-[535px] px-4 pb-4 flex-col items-start gap-6 rounded-tl-[20px] rounded-bl-[20px] shadow-lg">
          <SheetHeader className="gap-8">
            <SheetTitle className="text-white flex felx-col items-center gap-3">
              <ShoppingCart className="size-4" />
              <p>Order detail</p>
            </SheetTitle>
            <SheetDescription asChild>
              <Tabs defaultValue="Cart" className="w-full gap-8">
                <TabsList className="w-full flex p-1 items-center gap-2 rounded-full bg-white">
                  <TabsTrigger
                    className="cursor-pointer flex py-1 px-2 justify-center items-center rounded-full bg-white text-black"
                    value="Cart">
                    Cart
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer flex py-1 px-2 justify-center items-center rounded-full bg-white text-black"
                    value="Order">
                    Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="flex flex-col gap-8" value="Cart">
                  <div className="flex w-[479px] h-[508px] p-4 flex-col items-start gap-4 rounded-[20px] bg-white">
                    <div className="flex flex-col justify-start items-start gap-5 overflow-y-scroll max-h-[420px]">
                      <p className="h-[28px] text-[#09090B] text-[20px] font-semibold">
                        My cart
                      </p>
                      {orders.length == 0 ? (
                        <Cartempty />
                      ) : (
                        orders.map((val) => {
                          return (
                            <Order
                              key={val.foodId}
                              id={val.foodId}
                              quantity={val.quantity}
                            />
                          );
                        })
                      )}
                      <SheetClose className="w-full">
                        <button className="cursor-pointer flex w-full h-11 py-2 px-8 justify-center items-center gap-2 rounded-full border-[1px] border-[#EF4444] hover:bg-black text-[#EF4444] hover:text-white bg-white">
                          Add food
                        </button>
                      </SheetClose>
                    </div>
                  </div>

                  <Checkout
                    orders={orders}
                    onCheckoutClick={handleCheckoutClick}
                  />
                </TabsContent>
                <TabsContent className="flex flex-col gap-8" value="Order">
                  <div className="flex w-[479px]  p-4 flex-col items-start gap-4 rounded-[20px] bg-white">
                    <div className="flex overflow-y-scroll max-h-[808px] flex-col h-full justify-between items-start gap-5">
                      {checked.length > 0 ? (
                        <div className="flex flex-col gap-5 justify-between">
                          <p className="h-[28px] text-[#09090B] text-[20px] font-semibold">
                            Order history
                          </p>
                          {checked
                            .filter(
                              (val) =>
                                val.foodorderitems &&
                                val.foodorderitems.length > 0
                            )
                            .map((val, index) => {
                              return (
                                <Userorder
                                  key={index}
                                  orderban={index}
                                  total={val.totalPrice}
                                  state={val.status}
                                  foodname={val.foodorderitems}
                                  date={val.createdAt}
                                  add={input}
                                />
                              );
                            })}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-5 justify-between">
                          <p className="h-[28px] text-[#09090B] text-[20px] font-semibold">
                            Order history
                          </p>
                          <div className="flex py-8 px-12 flex-col text-center items-center gap-1 rounded-xl bg-[#f4f4f5]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="61"
                              height="50"
                              viewBox="0 0 61 50"
                              fill="none">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M28.466 0.324454C28.1516 0.64221 28.14 0.711116 28.1695 2.10014C28.1862 2.89486 28.1462 3.59941 28.0806 3.66556C28.0148 3.73171 27.3185 3.88054 26.5331 3.99604C23.0897 4.50293 20.1947 5.52419 17.1221 7.31615C14.9037 8.61001 13.7012 9.52036 11.8844 11.2812C10.0062 13.1017 8.76643 14.6891 7.16942 17.3187C6.71081 18.0741 5.8289 19.8416 5.8289 20.0058C5.8289 20.0395 5.68507 20.3851 5.50931 20.7737C4.52057 22.9595 3.641 26.9949 3.6092 29.4912C3.58726 31.2177 3.65541 31.1436 1.94663 31.3015C0.652322 31.4212 0.447226 31.4739 0.232006 31.7426C-0.106271 32.1649 -0.0735597 32.6251 0.323131 33.0262C0.655826 33.3626 0.671533 33.3648 2.10798 33.2797C2.90512 33.2324 5.30967 33.1068 7.45149 33.0005C9.59331 32.8942 12.3679 32.7486 13.6173 32.677C17.2052 32.4714 18.1132 32.424 19.913 32.3494C21.6829 32.2759 24.9368 32.1014 28.5451 31.8867C29.7231 31.8165 31.538 31.7281 32.578 31.6902C33.618 31.6523 34.9323 31.5949 35.4986 31.5629C36.065 31.5309 37.9302 31.4422 39.6437 31.3658C41.3571 31.2895 43.6936 31.1711 44.8359 31.1027C45.9782 31.0344 47.5846 30.9446 48.4056 30.9031C49.2267 30.8616 50.2489 30.8023 50.6773 30.7713C51.1056 30.7404 52.1863 30.6808 53.0787 30.6388C58.8981 30.3655 60.4665 30.2322 60.7333 29.988C61.0821 29.6688 61.0905 28.8639 60.7483 28.5507C60.5387 28.3588 60.2745 28.3285 59.0623 28.3567C58.2716 28.3752 57.582 28.3471 57.5298 28.2944C57.4776 28.2415 57.3368 27.5371 57.2168 26.7288C56.9734 25.0881 56.9258 24.856 56.6586 24.0125C56.5557 23.6876 56.4034 23.1561 56.3202 22.8312C56.2369 22.5064 56.116 22.1381 56.0517 22.0127C55.9871 21.8874 55.9344 21.718 55.9344 21.6365C55.9344 21.3288 54.6995 18.5459 54.0535 17.3979C53.1985 15.8782 52.446 14.7083 52.058 14.2954C51.891 14.1174 51.6001 13.7651 51.4116 13.5125C50.6138 12.4425 48.9907 10.8027 47.6644 9.72656C46.6339 8.89023 43.7889 6.99629 42.9537 6.59047C39.269 4.80021 35.8245 3.88199 32.1365 3.70716C30.9727 3.65191 30.4162 3.57302 30.2898 3.44532C30.1807 3.33507 30.1046 2.96534 30.098 2.51397C30.0731 0.814674 30.0361 0.544166 29.7906 0.269985C29.4505 -0.109984 28.872 -0.0862278 28.466 0.324454ZM18.1578 9.73903C18.1563 9.82932 17.908 10.2954 17.6062 10.775C16.7777 12.0908 15.1754 15.1334 15.1751 15.3912C15.175 15.45 15.029 15.8209 14.8505 16.2154C14.672 16.61 14.526 17.0078 14.526 17.0995C14.526 17.1911 14.4717 17.3224 14.4054 17.3909C14.2304 17.5718 13.4108 20.8482 13.1759 22.3062C12.9741 23.557 12.9005 24.302 12.774 26.375C12.6616 28.2143 12.3289 28.4691 9.99324 28.505C8.18153 28.533 7.85104 28.3924 7.52327 27.4545C7.27988 26.7581 7.44798 25.8403 8.2977 23.225C8.99463 21.0802 9.1443 20.7022 9.88226 19.2218C11.0558 16.8676 12.0783 15.2922 13.6304 13.4468C15.7308 10.9495 18.1711 8.951 18.1578 9.73903ZM36.1389 36.0505C33.99 36.103 28.2676 36.3676 25.3649 36.5487C22.9987 36.6964 21.9446 36.7558 18.4202 36.9409C16.3855 37.0476 14.0197 37.1925 13.163 37.2628C12.3063 37.3332 9.94054 37.4559 7.90581 37.5356C5.87109 37.6154 4.1257 37.7071 4.02731 37.7395C3.84324 37.8002 3.85661 38.0144 4.12946 39.3687C4.33105 40.37 4.90506 42.2851 5.18233 42.8816C5.32732 43.1935 5.53969 43.6971 5.65418 44.0009C6.23896 45.5515 7.4903 47.7453 8.61742 49.1958C8.96102 49.6381 9.25178 50 9.2636 50C9.27541 50 9.57345 49.8597 9.926 49.6883C11.7254 48.8132 12.5716 48.4318 13.1411 48.2391C14.9842 47.616 18.065 47.2126 20.1666 47.3196C22.1212 47.419 32.3687 47.4159 33.8023 47.3154C35.3019 47.2104 36.1838 47.031 37.0475 46.6555C37.3331 46.5313 38.2093 46.1643 38.9946 45.8402C39.78 45.516 40.4809 45.2039 40.5523 45.1465C40.6237 45.0891 41.3657 44.7425 42.2011 44.3762C43.0364 44.0099 43.825 43.6518 43.9535 43.5806C44.2327 43.4254 45.2469 42.9603 47.6917 41.866C48.6912 41.4186 49.8011 40.9133 50.158 40.7431C50.515 40.5727 51.1575 40.2761 51.5859 40.0838C52.442 39.6995 53.4911 39.2087 55.1154 38.4328C55.7001 38.1535 56.215 37.925 56.2595 37.925C56.4443 37.925 57.7343 37.272 57.8172 37.1367C57.8666 37.0559 57.799 36.8671 57.6671 36.7174C57.0821 36.0531 55.9417 35.9188 54.4328 36.3366C53.1322 36.6967 51.3681 37.2481 51.0667 37.3888C50.9239 37.4554 50.3398 37.6616 49.7686 37.8468C48.1816 38.3615 44.6956 39.5942 44.2204 39.8088C43.9878 39.9138 43.5054 40.0994 43.1484 40.2213C42.7915 40.3431 41.9153 40.6484 41.2013 40.8998C39.7772 41.4011 35.3971 42.3488 33.9211 42.475C32.7802 42.5726 32.3756 42.4802 32.1035 42.0603C31.633 41.3342 31.9854 40.3308 32.826 40.0029C33.2771 39.8269 35.1335 39.5054 35.7146 39.5024C36.1974 39.5 39.1613 39.0215 41.0026 38.6484C42.3034 38.3852 43.2736 37.8789 43.5316 37.3291C43.784 36.7915 43.7827 36.6806 43.52 36.2752L43.3075 35.9472L40.3072 35.9845C38.6572 36.0051 36.7814 36.0347 36.1389 36.0505Z"
                                fill="#EF4444"
                              />
                            </svg>
                            <p className="text-[#09090B] text-[16px] font-bold">
                              No Orders Yet?
                            </p>
                            <p className="text-[#71717A] text-[12px]">
                              🍕 "You haven't placed any orders yet. Start
                              exploring our menu and satisfy your cravings!"
                            </p>
                          </div>
                        </div>
                      )}
                      <SheetClose className="w-full" asChild>
                        <button className="cursor-pointer flex w-full h-11 py-2 px-8 justify-center items-center gap-2 rounded-full border-[1px] border-[#EF4444] hover:bg-black text-[#EF4444] hover:text-white bg-white">
                          Add food
                        </button>
                      </SheetClose>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="relative group h-[35px]">
        <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#EF4444] hover:bg-[#000000] text-white ">
          <User className="size-4" />
        </div>
        <div className="hidden group-hover:flex">
          <Dropmail mail={email} onclick={signout} />
        </div>
      </div>

      {cartCount > 0 && (
        <div className="flex size-5 flex-col justify-center items-center gap-[10px] absolute right-[142px] top-[9px] rounded-full bg-[#EF4444] text-[#FAFAFA] text-[13px]">
          {cartCount}
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
};
