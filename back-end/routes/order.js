import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderByUserId,
  updateOrder,
} from "../controllers/order.js";
import express from "express";
import { verifytoken } from "../middleware/auth.js";
export const orderRouter = express.Router();

orderRouter
  .post("/", verifytoken, createOrder)
  .get("/byid", verifytoken, getOrderByUserId)
  .get("/", getAllOrders)
  .delete("/cancel", verifytoken, deleteOrder)
  .put("/:orderid", updateOrder);
