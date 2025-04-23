import { Usermodel } from "../model/user.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usermodel.findOne({ email: email });
    console.log(user, "user");
    console.log(password, user.password);
    const pass = await bcrypt.compare(password, user.password);
    console.log(pass, "pass");
    if (pass) {
      return res.status(200).send({
        success: "True",
        message: "success",
      });
    } else {
      return res.status(404).send({
        success: "false",
        message: "Email or Password wrong",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(404).send({
      success: "false",
    });
  }
};
