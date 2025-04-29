import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.js";
import express from "express";
import { verifytoken } from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter
  .post("/", createUser)
  .get("/byid", verifytoken, getUserById)
  .get("/", getUsers)
  .delete("/", deleteUser)
  .put("/", verifytoken, updateUser);
