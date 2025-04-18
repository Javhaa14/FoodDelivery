import mongoose from "mongoose";

const categoryschema = new mongoose.Schema({
  categoryName: {
    type: String,
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
export const Categorymodel = mongoose.model("Categories", categoryschema);
