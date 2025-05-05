import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Cartempty } from "./Cartempty";
import { Order } from "./Order";
import { Checkout } from "./Checkout";
import { Userorder } from "./Userorder";
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

type CartItem = {
  foodId: string;
  price: number;
  quantity: number;
};
interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orders: CartItem[];
  checked: Orders[];
  input: string;
  handleCheckoutClick: () => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  open,
  onOpenChange,
  orders,
  checked,
  input,
  handleCheckoutClick,
}) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer w-full px-2">
          <div className="cursor-pointer flex size-9 justify-center items-center gap-2 rounded-full bg-[#F4F4F5] hover:bg-black text-black hover:text-white">
            <ShoppingCart className="size-4" />
          </div>
        </motion.div>
      </SheetTrigger>

      <AnimatePresence mode="popLayout">
        {open && (
          <motion.div
            key="cart-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}>
            <SheetContent
              side="right"
              className="p-0 bg-transparent border-none">
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#404040] overflow-scroll flex w-[535px] h-screen px-4 pb-4 flex-col items-start gap-6 rounded-tl-[20px] rounded-bl-[20px] shadow-lg">
                <SheetHeader className="gap-8">
                  <SheetTitle className="text-white flex flex-col items-center gap-3">
                    <div className="flex w-full items-center gap-2">
                      <ShoppingCart className="size-4" />
                      <span>Order detail</span>
                    </div>
                  </SheetTitle>
                  <SheetDescription>
                    <Tabs defaultValue="Cart" className="w-full gap-8">
                      <TabsList className="w-full flex p-1 items-center gap-2 rounded-full bg-white">
                        <motion.div
                          className="w-full flex p-1 items-center gap-2 rounded-full bg-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer">
                            <TabsTrigger
                              value="Cart"
                              className="cursor-pointer py-1 px-2 rounded-full text-black bg-white w-[220px]">
                              Cart
                            </TabsTrigger>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer">
                            <TabsTrigger
                              value="Order"
                              className="cursor-pointer py-1 px-2 rounded-full text-black bg-white w-[227px]">
                              Orders
                            </TabsTrigger>
                          </motion.div>
                        </motion.div>
                      </TabsList>

                      <TabsContent value="Cart" className="flex flex-col gap-8">
                        <div className="flex w-[479px] h-[508px] p-4 flex-col items-start gap-4 rounded-[20px] bg-white">
                          <div className="flex flex-col justify-start items-start gap-5 overflow-y-scroll max-h-[420px]">
                            <span className="text-[20px] font-semibold text-[#09090B]">
                              My cart
                            </span>
                            {orders.length === 0 ? (
                              <Cartempty />
                            ) : (
                              orders.map((val) => (
                                <Order
                                  key={val.foodId}
                                  id={val.foodId}
                                  quantity={val.quantity}
                                />
                              ))
                            )}
                            <motion.div
                              whileHover={{ scale: 1 }}
                              whileTap={{ scale: 0.95 }}
                              className="cursor-pointer w-full">
                              <button
                                onClick={handleClose}
                                className="w-full cursor-pointer h-11 py-2 px-8 border border-[#EF4444] rounded-full text-[#EF4444] hover:bg-[#EF4444] hover:text-white">
                                Add food
                              </button>
                            </motion.div>
                          </div>
                        </div>
                        <Checkout
                          orders={orders}
                          onCheckoutClick={handleCheckoutClick}
                        />
                      </TabsContent>

                      <TabsContent
                        value="Order"
                        className="flex flex-col gap-8">
                        <div className="flex w-[479px] p-4 flex-col items-start gap-4 rounded-[20px] bg-white">
                          <div className="flex overflow-y-scroll max-h-[808px] flex-col gap-5">
                            {checked.length > 0 ? (
                              <>
                                <span className="text-[20px] font-semibold text-[#09090B]">
                                  Order history
                                </span>
                                {checked
                                  .filter(
                                    (val) => val.foodorderitems?.length > 0
                                  )
                                  .map((val, index) => (
                                    <Userorder
                                      key={index}
                                      orderban={index}
                                      total={val.totalPrice}
                                      state={val.status}
                                      foodname={val.foodorderitems}
                                      date={val.createdAt}
                                      add={input}
                                    />
                                  ))}
                              </>
                            ) : (
                              <Cartempty />
                            )}
                            <motion.div
                              whileHover={{ scale: 1 }}
                              whileTap={{ scale: 0.95 }}
                              className="cursor-pointer w-full">
                              <button
                                onClick={handleClose}
                                className="w-full cursor-pointer h-11 py-2 px-8 border border-[#EF4444] rounded-full text-[#EF4444] hover:bg-[#EF4444] hover:text-white">
                                Add food
                              </button>
                            </motion.div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </SheetDescription>
                </SheetHeader>
              </motion.div>
            </SheetContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
};
