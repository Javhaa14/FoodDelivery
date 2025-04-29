import nodemon from "nodemon";
import express, { json } from "express";
import cors from "cors";
import { connectMongoDB } from "./connectDB.js";
import { userRouter } from "./routes/user.js";
import { foodRouter } from "./routes/food.js";
import { categoryRouter } from "./routes/category.js";
import { orderRouter } from "./routes/order.js";
import { authRouter } from "./routes/auth.js";

connectMongoDB();
const port = process.env.PORT || 9999;
const app = express();

app.use(json());
app.use(cors());

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/food", foodRouter);
app.use("/order", orderRouter);
app.use("/login", authRouter);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}/`);
});
