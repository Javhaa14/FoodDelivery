import { Usermodel } from "../model/user.js";

export const createUser = async (req, res) => {
  const { email, password, phoneNumber, address, isVerified } = req.body;
  try {
    const user = await Usermodel.create({
      email: email,
      password: password,
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
export const getUsers = async (_, res) => {
  try {
    const users = await Usermodel.find();
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
  const { id } = req.params;
  const user = await Usermodel.findById(id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).send({ user: user });
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
  const { id, password, email, phoneNumber, address } = req.body;

  try {
    const user = await Usermodel.findById(id);
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
