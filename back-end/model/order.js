import mongoose, { Schema } from "mongoose";

const foodorderitems = new mongoose.Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "Foods",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderschema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
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

export const Ordermodel = mongoose.model("Orders", orderschema);
