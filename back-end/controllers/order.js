import { Ordermodel } from "../model/order.js";
import { Foodmodel } from "../model/food.js";

export const createOrder = async (req, res) => {
  const { userid, items } = req.body;

  let foodnames = items.split(",");

  try {
    const foods = await Foodmodel.find({ name: { $in: foodnames } });

    const totalPrice = foods.reduce((sum, food) => sum + food.price, 0);

    const order = await Ordermodel.create({
      user: userid,
      totalPrice,
      foodorderitems: foodnames,
    });

    res.status(200).send({
      success: true,
      order,
    });
  } catch (error) {
    console.error("ERROR", error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

// export const getOrders = async (_, res) => {
//   try {
//     const users = await Usermodel.find();
//     res.status(200).send(users);
//   } catch (error) {
//     console.log(error, "ERROOR");
//     res
//       .status(400)
//       .send({
//         success: false,
//         message: error.message,
//       })
//       .end();
//   }
// };

// export const getOrderById = async (req, res) => {
//   const { id } = req.params;
//   const user = await Usermodel.findById(id);

//   if (!user) {
//     return res.status(404).send({
//       success: false,
//       message: "User not found.",
//     });
//   }

//   return res.status(200).send({ user: user });
// };
// export const deleteOrder = async (req, res) => {
//   const { id } = req.body;
//   const users = await Usermodel.findByIdAndDelete(id);
//   res.status(200).send({
//     success: true,
//     message: "Amjilttai ustsan",
//   });
//   if (!users) {
//     return res.status(404).send({
//       success: false,
//       message: "User not found.",
//     });
//   }
// };
// export const updateOrder = async (req, res) => {
//   const { id, password, email, phoneNumber, address } = req.body;

//   try {
//     const user = await Usermodel.findById(id);
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (password !== undefined) user.password = password;
//     if (email !== undefined) user.email = email;
//     if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
//     if (address !== undefined) user.address = address;

//     await user.save();

//     return res.status(200).send({
//       success: true,
//       message: "User updated successfully.",
//       user,
//     });
//   } catch (error) {
//     console.log(error, "UPDATE ERROR");
//     return res.status(400).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };
