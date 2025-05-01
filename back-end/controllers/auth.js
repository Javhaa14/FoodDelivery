import { Usermodel } from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { s } from "../utils/sendmail.js";
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

export const sendmail = async (req, res) => {
  const { email, subject, text } = req.body;
  try {
    const response = s(email, subject, text);
    res.status(200).send({ success: "true", data: response });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
