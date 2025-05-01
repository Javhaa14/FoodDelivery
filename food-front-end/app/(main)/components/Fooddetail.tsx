import { DialogClose } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { Check } from "lucide-react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";

interface FoodcardProps {
  name: string;
  ingredients: string;
  price: string | number;
  image: string;
  id: string;
}

export const Fooddetail = ({
  name,
  ingredients,
  price,
  image,
  id,
}: FoodcardProps) => {
  const [quantity, setQuantity] = useState(1);
  const isLoggedIn = Cookies.get("Loggedin") === "true";

  const hasah = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nemeh = () => {
    setQuantity(quantity + 1);
  };

  const real =
    (typeof price === "string" ? parseFloat(price) : price) * quantity;

  const addOrder = (foodId: string, price: number) => {
    if (isLoggedIn == true) {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const existingIndex = storedOrders.findIndex(
        (o: any) => o.foodId === foodId
      );

      let updatedOrders;
      if (existingIndex !== -1) {
        storedOrders[existingIndex].quantity += quantity;
        updatedOrders = [...storedOrders];
      } else {
        updatedOrders = [
          ...storedOrders,
          { foodId, price, quantity: quantity },
        ];
      }

      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      const currentCount = parseInt(
        localStorage.getItem("cartCount") || "0",
        10
      );
      localStorage.setItem("cartCount", (currentCount + quantity).toString());
      toast.custom((t) => (
        <div
          className={`w-[320px] p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all border-[1px] border-white`}
        >
          <Check className="size-4 text-white" />
          <span className="text-[16px] font-medium text-[#FAFAFA]">
            Food is being added to the cart!
          </span>
        </div>
      ));
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      toast.custom((t) => (
        <div
          className={`max-w-[320px] w-fit p-4 rounded-xl shadow-lg bg-[#18181b] text-white flex items-center gap-4 transition-all border-[1px] border-white`}
        >
          <Check className="size-4 text-white" />
          <span className="text-[16px] font-medium text-[#FAFAFA]">
            Please Login First!
          </span>
        </div>
      ));
    }
  };

  return (
    <div className="flex w-[826px] h-[412px] p-6 items-start gap-6 rounded-[20px] bg-white">
      <Toaster position="top-center" />
      <img
        className="rounded-xl min-w-[370px] h-[370px]"
        src={`${image}`}
        alt="Food Image"
      />
      <div className="flex flex-col items-end self-stretch">
        <div className="flex h-full flex-col justify-between items-start self-stretch">
          <div className="flex flex-col items-start gap-3 self-stretch">
            <p className="w-[295px] text-[30px] text-[#EF4444] font-semibold">
              {name}
            </p>
            <p className="self-stretch text-[#09090B] text-[16px]">
              {ingredients}
            </p>
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch">
            <div className="flex justify-between items-center self-stretch">
              <div className="flex flex-col items-start">
                <p className="text-[#09090B] text-[16px]">Total price</p>
                <p className="text-[#09090B] text-[24px] font-semibold">
                  {real}₮
                </p>
              </div>
              <div className="flex justify-center items-center gap-3 text-[#09090B]">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  {" "}
                  <div
                    className={`${
                      quantity <= 1
                        ? "opacity-[0.2] cursor-no-drop"
                        : "cursor-pointer"
                    } flex size-11 justify-center items-center gap-2 rounded-full border-[1px] border-[#E4E4E7] bg-white hover:bg-black hover:text-white`}
                  >
                    <Minus onClick={hasah} className="size-4" />
                  </div>{" "}
                </motion.div>
                <p className="text-[18px] font-semibold">{quantity}</p>{" "}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <div className="cursor-pointer flex size-11 justify-center items-center gap-2 rounded-full border-[1px] border-[#E4E4E7] bg-white hover:bg-black hover:text-white">
                    <Plus onClick={nemeh} className="size-4" />
                  </div>
                </motion.div>
              </div>
            </div>
            <DialogClose asChild>
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <button
                  onClick={() => {
                    addOrder(
                      id,
                      typeof price === "string" ? parseFloat(price) : price
                    );
                  }}
                  className="cursor-pointer w-[373px] flex h-[44px] py-2 px-[32px] justify-center items-center gap-2 self-stretch rounded-full bg-[#18181B] hover:bg-[#EF4444]"
                >
                  Add to cart
                </button>{" "}
              </motion.div>
            </DialogClose>
          </div>
        </div>
      </div>
    </div>
  );
};
