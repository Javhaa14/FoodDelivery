import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.js";
export const categoryRouter = express.Router();

categoryRouter
  .post("/", addCategory)
  .get("/", getCategory)
  .get("/:id", getCategoryById)
  .delete("/", deleteCategory)
  .put("/", updateCategory);
