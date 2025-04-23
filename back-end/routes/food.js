import {
  addFood,
  deleteFood,
  getFoodById,
  getFoods,
  getFoodsByCatId,
  updateFood,
} from "../controllers/food.js";
import express from "express";
export const foodRouter = express.Router();

foodRouter
  .post("/", addFood)
  .get("/", getFoods)
  .get("/:id", getFoodById)
  .get("/category/:categoryid", getFoodsByCatId)
  .delete("/:id", deleteFood)
  .put("/:id", updateFood);
