import mongoose, { Schema } from "mongoose";

const orderschema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  totalPrice: Number,
  foodorderitems: [foodorderitems],
  status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "DELIVERED"],
    default: "PENDING",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export const foodorderitems = new mongoose.Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "foodorderitems",
  },
  quantity: Number,
});
// export const foodorderitemsmodel = mongoose.model(
//   "Foodorderitems",
//   foodorderitems
// );
export const Ordermodel = mongoose.model("Orders", orderschema);
