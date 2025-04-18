import { configDotenv } from "dotenv";
import { connect } from "mongoose";
configDotenv();

console.log(process.env.MONGO_URI);

export const connectMongoDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected");
  } catch (error) {
    console.log(error, "error");
  }
};
