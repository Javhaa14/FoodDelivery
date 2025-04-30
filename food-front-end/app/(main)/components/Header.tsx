"use client";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
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
import { Order } from "./Order";

import { Cartempty } from "./Cartempty";
import { Checkout } from "./Checkout";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { Userorder } from "./Userorder";
import { Dropmail } from "./Dropmail";

type Order = {
  foodId: string;
  price: number;
  quantity: number;
};
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
export const Header = ({}) => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState("");
  const [input, setInput] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
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
  const handleon = (path: string) => {
    router.push(`/${path}`);
  };
  const path = [
    { name: "Sign up", path: "signin", color: "bg-[#f4f4f5] text-black" },
    { name: "Log in", path: "login", color: "bg-[#EF4444] text-white" },
  ];
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
  const isLoggedIn = Cookies.get("Loggedin") === "true";

  const signout = () => {
    Cookies.set("Loggedin", "false", { expires: 365 });
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="flex w-full px-[88px] py-3 justify-between items-center bg-[#18181B] fixed z-50">
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="38"
          viewBox="0 0 46 38"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.4661 0.596961C21.2291 0.833946 21.2203 0.885337 21.2426 1.92128C21.2552 2.51399 21.225 3.03945 21.1755 3.08878C21.1259 3.13812 20.6008 3.24912 20.0086 3.33526C17.4119 3.7133 15.2288 4.47496 12.9118 5.81142C11.2389 6.77639 10.332 7.45534 8.96201 8.7686C7.54568 10.1263 6.61075 11.3102 5.40645 13.2714C5.06061 13.8348 4.39556 15.153 4.39556 15.2755C4.39556 15.3006 4.28711 15.5584 4.15457 15.8482C3.40896 17.4783 2.74567 20.488 2.72169 22.3498C2.70515 23.6374 2.75654 23.5821 1.46795 23.6998C0.491915 23.7891 0.337253 23.8285 0.174956 24.0288C-0.0801388 24.3438 -0.0554713 24.687 0.243672 24.9862C0.494558 25.2371 0.506402 25.2387 1.58962 25.1752C2.19075 25.14 4.00401 25.0463 5.61916 24.967C7.2343 24.8877 9.32664 24.7791 10.2688 24.7257C12.9744 24.5724 13.6591 24.5371 15.0163 24.4814C16.351 24.4266 18.8048 24.2965 21.5258 24.1363C22.4142 24.084 23.7827 24.0181 24.567 23.9898C25.3513 23.9615 26.3424 23.9187 26.7695 23.8948C27.1966 23.8709 28.6031 23.8048 29.8952 23.7478C31.1873 23.6909 32.9493 23.6026 33.8107 23.5516C34.6721 23.5006 35.8835 23.4337 36.5026 23.4028C37.1217 23.3718 37.8926 23.3276 38.2156 23.3045C38.5387 23.2814 39.3536 23.2369 40.0266 23.2056C44.4149 23.0018 45.5977 22.9024 45.7989 22.7203C46.0619 22.4822 46.0683 21.8819 45.8102 21.6483C45.6521 21.5052 45.4529 21.4826 44.5388 21.5036C43.9425 21.5174 43.4225 21.4965 43.3831 21.4571C43.3438 21.4177 43.2376 20.8923 43.1471 20.2895C42.9636 19.0659 42.9276 18.8928 42.7262 18.2637C42.6486 18.0214 42.5337 17.625 42.471 17.3827C42.4082 17.1404 42.317 16.8657 42.2685 16.7723C42.2198 16.6788 42.1801 16.5524 42.1801 16.4916C42.1801 16.2622 41.2488 14.1867 40.7617 13.3304C40.1169 12.1971 39.5495 11.3245 39.2569 11.0166C39.1309 10.8838 38.9115 10.6211 38.7694 10.4327C38.1678 9.6347 36.9438 8.4117 35.9437 7.60912C35.1665 6.98538 33.0212 5.57287 32.3913 5.2702C29.6127 3.93502 27.0152 3.2502 24.2341 3.11981C23.3564 3.0786 22.9368 3.01977 22.8415 2.92453C22.7592 2.8423 22.7019 2.56655 22.6969 2.22992C22.6781 0.96257 22.6502 0.760824 22.4651 0.556337C22.2086 0.272953 21.7723 0.290671 21.4661 0.596961ZM13.6928 7.61842C13.6916 7.68577 13.5044 8.03336 13.2768 8.39104C12.6521 9.37236 11.4437 11.6416 11.4436 11.8338C11.4435 11.8777 11.3333 12.1543 11.1987 12.4486C11.0641 12.7428 10.954 13.0395 10.954 13.1079C10.954 13.1763 10.9131 13.2742 10.8631 13.3253C10.7311 13.4601 10.1131 15.9037 9.93589 16.9911C9.78377 17.924 9.72827 18.4796 9.63283 20.0256C9.54806 21.3974 9.29718 21.5874 7.53589 21.6143C6.16967 21.6351 5.92045 21.5303 5.67329 20.8308C5.48975 20.3114 5.61651 19.6268 6.25728 17.6763C6.78284 16.0768 6.8957 15.7949 7.45219 14.6908C8.33719 12.935 9.10825 11.76 10.2787 10.3837C11.8626 8.52123 13.7028 7.0307 13.6928 7.61842ZM27.2523 27.2417C25.6318 27.2809 21.3166 27.4782 19.1276 27.6133C17.3433 27.7234 16.5484 27.7677 13.8906 27.9058C12.3563 27.9853 10.5723 28.0934 9.9262 28.1459C9.28014 28.1983 7.49615 28.2899 5.96176 28.3493C4.42738 28.4088 3.11118 28.4772 3.03699 28.5014C2.89818 28.5466 2.90826 28.7064 3.11402 29.7165C3.26604 30.4633 3.6989 31.8915 3.90799 32.3364C4.01733 32.569 4.17747 32.9446 4.26381 33.1712C4.70479 34.3277 5.64842 35.9638 6.49838 37.0456C6.75749 37.3755 6.97676 37.6454 6.98566 37.6454C6.99457 37.6454 7.21932 37.5407 7.48518 37.4129C8.8421 36.7603 9.48022 36.4758 9.90966 36.3321C11.2996 35.8673 13.6228 35.5665 15.2076 35.6463C16.6816 35.7204 24.4092 35.7182 25.4903 35.6432C26.6211 35.5649 27.2861 35.431 27.9375 35.151C28.1528 35.0584 28.8136 34.7847 29.4058 34.5429C29.998 34.3011 30.5266 34.0684 30.5804 34.0256C30.6343 33.9828 31.1938 33.7243 31.8238 33.4511C32.4537 33.1779 33.0484 32.9108 33.1453 32.8577C33.3558 32.742 34.1206 32.3951 35.9642 31.579C36.718 31.2453 37.5549 30.8684 37.8241 30.7415C38.0933 30.6144 38.5778 30.3932 38.9009 30.2498C39.5464 29.9632 40.3375 29.5972 41.5624 29.0184C42.0034 28.8101 42.3916 28.6397 42.4252 28.6397C42.5646 28.6397 43.5374 28.1527 43.5998 28.0518C43.6371 27.9915 43.5861 27.8508 43.4867 27.7391C43.0455 27.2437 42.1856 27.1435 41.0477 27.4551C40.0669 27.7237 38.7366 28.1349 38.5093 28.2399C38.4016 28.2895 37.9611 28.4433 37.5304 28.5814C36.3337 28.9653 33.7049 29.8847 33.3465 30.0447C33.1711 30.123 32.8074 30.2614 32.5382 30.3524C32.269 30.4432 31.6082 30.6709 31.0699 30.8583C29.9959 31.2323 26.6929 31.939 25.5799 32.0332C24.7195 32.1059 24.4144 32.037 24.2092 31.7239C23.8544 31.1823 24.1202 30.434 24.7541 30.1895C25.0942 30.0582 26.4941 29.8184 26.9324 29.8161C27.2964 29.8144 29.5315 29.4575 30.92 29.1793C31.9009 28.9829 32.6325 28.6054 32.8271 28.1953C33.0174 27.7944 33.0165 27.7117 32.8183 27.4093L32.6581 27.1647L30.3956 27.1925C29.1514 27.2078 27.7368 27.2299 27.2523 27.2417Z"
            fill="#EF4444"
          />
        </svg>
        <div className="flex flex-col items-start self-stretch">
          <div className="flex text-[20px] font-semibold">
            <p className="text-[#FAFAFA]">Yum</p>
            <p className="text-[#EF4444]">Yum</p>
          </div>
          <p className="text-[#F4F4F5] text-[12px]">Swift delivery</p>
        </div>
      </div>
      <div className={`flex items-center gap-3`}>
        {isLoggedIn ? (
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
                      <p className="text-[#EF4444] text-[12px]">
                        Delivery address:
                      </p>
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
              <SheetTrigger>
                <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#F4F4F5]">
                  <ShoppingCart className="text-black size-4" />
                </div>
              </SheetTrigger>
              <SheetContent className="bg-[#404040] flex w-[535px] px-4 pb-4 flex-col items-start gap-6 rounded-tl-[20px] rounded-bl-[20px] shadow-lg">
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
                      <TabsContent
                        className="flex flex-col gap-8"
                        value="Order">
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
                                    exploring our menu and satisfy your
                                    cravings!"
                                  </p>
                                </div>
                              </div>
                            )}
                            <SheetClose className="w-full">
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
              <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#EF4444]">
                <User className="text-white size-4" />
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
        ) : (
          path.map((v) => {
            return (
              <button
                key={v.path}
                onClick={() => {
                  handleon(v.path);
                }}
                className={`cursor-pointer flex h-9 py-2 px-3 justify-center items-center gap-2 rounded-full ${v.color} brightness-100 hover:brightness-75`}>
                {v.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
