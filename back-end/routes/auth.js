import express from "express";
import { login, reset } from "../controllers/auth.js";
export const authRouter = express.Router();
authRouter.post("/", login).post("/mail", reset);
