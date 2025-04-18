import { createOrder } from "../controllers/order.js";
import express from "express";
export const orderRouter = express.Router();

orderRouter.post("/", createOrder);
// .get("/", getOrders)
// .get("/:id", getOrderById)
// .delete("/", deleteOrder)
// .put("/", deleteOrder);
