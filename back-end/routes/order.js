import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderByUserId,
  updateOrder,
} from "../controllers/order.js";
import express from "express";
export const orderRouter = express.Router();

orderRouter
  .post("/", createOrder)
  .get("/:id", getOrderByUserId)
  .get("/", getAllOrders)
  .delete("/cancel", deleteOrder)
  .put("/:orderid", updateOrder);
