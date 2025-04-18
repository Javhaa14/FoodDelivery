import { Ordermodel } from "../model/order.js";

export const createOrder = async (req, res) => {
  const { userid, foodorderitems, totalPrice } = req.body;

  try {
    const order = await Ordermodel.create({
      user: userid,
      foodorderitems: foodorderitems,
      totalPrice: totalPrice,
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

export const getAllOrders = async (_, res) => {
  try {
    const Allorders = await Ordermodel.find();
    res.status(200).send(Allorders);
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

export const getOrderByUserId = async (req, res) => {
  const { id } = req.params;
  const orderbyuserid = await Ordermodel.find({ user: id }).populate("user");
  if (!orderbyuserid) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }
  return res.status(200).send({ orderbyuserid: orderbyuserid });
};

export const deleteOrder = async (req, res) => {
  const { id } = req.body;
  const orders = await Ordermodel.findByIdAndDelete(id);
  if (!orders) {
    return res.status(404).send({
      success: false,
      message: "Order not found.",
    });
  }
  res.status(200).send({
    success: true,
    message: "Amjilttai ustsan",
  });
};
export const updateOrder = async (req, res) => {
  const { orderid } = req.params;
  const { foodorderitems, totalPrice } = req.body;

  try {
    const order = await Ordermodel.findById(orderid);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found.",
      });
    }
    if (foodorderitems !== undefined) order.foodorderitems = foodorderitems;
    if (totalPrice !== undefined) order.totalPrice = totalPrice;
    await order.save();
    return res.status(200).send({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.log(error, "UPDATE ERROR");
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
