import { Usermodel } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { s } from "../utils/sendmail.js";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET_KEY;
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email: email });
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.status(404).send({
        success: "false",
        message: "Имэйл эсвэл нууц үг буруу байна!",
      });
    }

    const token = jwt.sign({ ...user }, secret, { expiresIn: 3600 });

    return res.status(200).send({
      success: "True",
      message: "success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: "false",
      message: "Имэйл эсвэл нууц үг буруу байна!",
    });
  }
};
export const reset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Usermodel.findOne({ email: email });
    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: 180,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-pass?token=${token}`;

    await s(
      email,
      "Reset your password",
      `Click here to reset your password: ${resetLink}`
    );
    return res.status(200).send({
      success: "True",
      message: "success",
      token,
    });
  } catch (error) {
    res.status(404).send({
      success: "false",
      message: "Server error!",
    });
  }
};
// export const sendmail = async (req, res) => {
//   const { email, subject, text } = req.body;
//   try {
//     const response = s(email, subject, text);
//     res.status(200).send({ success: "true", data: response });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
