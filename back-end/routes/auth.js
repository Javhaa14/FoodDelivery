import express from "express";
import { login, sendmail } from "../controllers/auth.js";
export const authRouter = express.Router();
authRouter.post("/", login).get("/mail", sendmail);
