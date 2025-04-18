import mongoose, { Schema } from "mongoose";

const foodschema = new mongoose.Schema({
  name: String,
  ingredients: String,
  image: String,
  price: Number,
  category: {
    type: [Schema.Types.ObjectId],
    ref: "Categories",
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
export const Foodmodel = mongoose.model("Foods", foodschema);
