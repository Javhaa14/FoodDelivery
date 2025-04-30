import { Usermodel } from "../model/user.js";
import bcrypt from "bcrypt";
export const createUser = async (req, res) => {
  const { email, password, phoneNumber, address, isVerified } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed, "pass");
  try {
    const user = await Usermodel.create({
      email: email,
      password: hashed,
      phoneNumber: phoneNumber,
      address: address,
      isVerified: isVerified,
    });
    res
      .status(200)
      .send({
        success: true,
        user: user,
      })
      .end();
  } catch (error) {
    console.log(error, "ERROOR");
    res
      .status(400)
      .send({
        success: false,
        message: error.message,
      })
      .end();
  }
};
export const userCheck = async (req, res) => {
  const { email } = req.body;

  try {
    const olduser = await Usermodel.find({ email: email });

    if (olduser.length > 0) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    res.status(200).send({ success: true, message: "Email is available" });
  } catch (error) {
    console.error("Error checking user:", error);

    res.status(400).send({
      success: false,
      message: "An error occurred while checking the user",
    });
  }
};

export const getUsers = async (_, res) => {
  try {
    const users = await Usermodel.find().select("-password");
    res.status(200).send(users);
  } catch (error) {
    console.log(error, "ERROOR");
    res
      .status(400)
      .send({
        success: false,
        message: error.message,
      })
      .end();
  }
};

export const getUserById = async (req, res) => {
  const { userData } = req.body;
  const user = await Usermodel.findById(userData._id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).send(user);
};
export const deleteUser = async (req, res) => {
  const { id } = req.body;
  const users = await Usermodel.findByIdAndDelete(id);
  res.status(200).send({
    success: true,
    message: "Amjilttai ustsan",
  });
  if (!users) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }
};
export const updateUser = async (req, res) => {
  const { id, password, email, phoneNumber, address, userData } = req.body;

  try {
    const user = await Usermodel.findById(userData._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    if (password !== undefined) user.password = password;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.log(error, "UPDATE ERROR");
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
