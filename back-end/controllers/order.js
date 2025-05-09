import { Ordermodel } from "../model/order.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Ordermodel.create({
      user: req.body.userData._id,
      foodorderitems: req.body.foodorderitems.map((item) => ({
        food: item.food,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: req.body.totalPrice,
    });

    const populatedOrder = await Ordermodel.findById(order._id)
      .populate("user")
      .populate({
        path: "foodorderitems.food",
        model: "Foods",
        select: "name price image",
      });

    res.status(200).json({
      success: true,
      order: populatedOrder,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (_, res) => {
  try {
    const Allorders = await Ordermodel.find()
      .populate({
        path: "user",
        select: "email address",
      })
      .populate({
        path: "foodorderitems.food",
        select: "name image",
      });
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
  const { userData } = req.body;
  try {
    const orderbyuserid = await Ordermodel.find({ user: userData._id })
      .populate({
        path: "user",
        select: "email address",
      })
      .populate({
        path: "foodorderitems.food",
        select: "name",
      });

    if (!orderbyuserid || orderbyuserid.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No orders found for this user.",
      });
    }
    return res.status(200).send(orderbyuserid);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Server error while fetching orders",
    });
  }
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
  const { status } = req.body;

  try {
    const order = await Ordermodel.findById(orderid);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found.",
      });
    }
    if (status !== undefined) order.status = status;
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
