import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.js";
import express from "express";

export const userRouter = express.Router();

userRouter
  .post("/", createUser)
  .get("/", getUsers)
  .get("/:id", getUserById)
  .delete("/", deleteUser)
  .put("/", updateUser);
