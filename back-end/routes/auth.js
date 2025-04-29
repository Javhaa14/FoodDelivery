import express from "express";
import { login } from "../controllers/auth.js";
export const authRouter = express.Router();
authRouter.post("/", login);
