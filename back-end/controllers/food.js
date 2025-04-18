import { Foodmodel } from "../model/food.js";

export const addFood = async (req, res) => {
  const { name, ingredients, price, image, category } = req.body;
  try {
    const foods = await Foodmodel.create({
      name: name,
      ingredients: ingredients,
      price: price,
      image: image,
      category: category,
    });
    res
      .status(200)
      .send({
        success: true,
        foods: foods,
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
export const getFoods = async (_, res) => {
  try {
    const foods = await Foodmodel.find();
    res.status(200).send(foods);
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

export const getFoodsByCatId = async (req, res) => {
  const { categoryid } = req.params;

  try {
    const foods = await Foodmodel.find({ category: categoryid }).populate(
      "category"
    );
    if (foods.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No foods found for this category.",
      });
    }
    res.status(200).send(foods);
  } catch (error) {
    console.log(error, "ERROR");
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getFoodById = async (req, res) => {
  const { id } = req.params;
  const user = await Foodmodel.findById(id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).send({ user: user });
};
export const deleteFood = async (req, res) => {
  const { id } = req.body;
  const foods = await Foodmodel.findByIdAndDelete(id);
  res.status(200).send({
    success: true,
    message: "Amjilttai ustsan",
  });
  if (!foods) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }
};
export const updateFood = async (req, res) => {
  const { id, name, ingredients, price, image, category } = req.body;

  try {
    const foods = await Foodmodel.findById(id);
    if (!foods) {
      return res.status(404).send({
        success: false,
        message: "food not found.",
      });
    }

    if (name !== undefined) foods.name = name;
    if (ingredients !== undefined) foods.ingredients = ingredients;
    if (price !== undefined) foods.price = price;
    if (image !== undefined) foods.image = image;
    if (category !== undefined) foods.category = category;

    await foods.save();

    return res.status(200).send({
      success: true,
      message: "food updated successfully.",
      foods,
    });
  } catch (error) {
    console.log(error, "UPDATE ERROR");
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
