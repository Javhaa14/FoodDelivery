import { Categorymodel } from "../model/category.js";
import { Foodmodel } from "../model/food.js";

export const addFood = async (req, res) => {
  const { name, ingredients, price, image, category } = req.body;
  try {
    const food = await Foodmodel.create({
      name,
      ingredients,
      price,
      image,
      category,
    });

    res.status(200).send({
      success: true,
      food,
    });
  } catch (error) {
    console.error("❌ Add food error:", error);
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

export const getFoods = async (_, res) => {
  try {
    console.log("1. Starting getFoods...");

    const foods = await Foodmodel.find().lean();
    console.log("2. Query completed. Found", foods.length, "foods");
    console.log("3. Sample food:", foods.length > 0 ? foods[0] : "No foods");

    if (!foods.length) {
      console.warn("4. WARNING: Empty food array returned");
    }

    res.status(200).send(foods);
  } catch (error) {
    console.error("5. ERROR in getFoods:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).send({
      error: "Internal Server Error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getFoodsByCatId = async (req, res) => {
  const { categoryid } = req.params;
  try {
    const foods = await Foodmodel.find({ category: categoryid }).populate(
      "category"
    );
    res.status(200).send(foods);
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};
// export const getFoodsByCatId = async (_, res) => {
//   console.log("working");
//   try {
//     const foods = await Categorymodel.aggregate([
//       {
//         $lookup: {
//           from: "foods",
//           localField: "_id",
//           foreignField: "category",
//           as: "foods",
//         },
//       },
//       {
//         $project: {
//           categoryName: 1,
//           foods: 1,
//         },
//       },
//     ]);
//     res.status(200).send(foods);
//   } catch (error) {
//     res.status(400).send({ success: false, message: error.message });
//   }
// };

export const getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Foodmodel.findById(id);
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found." });
    }
    return res.status(200).send(food);
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Foodmodel.findByIdAndDelete(id);
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found." });
    }
    res.status(200).send({ success: true, message: "Амжилттай устлаа." });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export const updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, price, image, category } = req.body;

  try {
    const food = await Foodmodel.findById(id);
    if (!food) {
      return res
        .status(404)
        .send({ success: false, message: "Food not found." });
    }

    if (name !== undefined) food.name = name;
    if (ingredients !== undefined) food.ingredients = ingredients;
    if (price !== undefined) food.price = price;
    if (image !== undefined) food.image = image;
    if (category !== undefined) food.category = category;

    await food.save();

    return res.status(200).send({
      success: true,
      message: "Food updated successfully.",
      food,
    });
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(400).send({ success: false, message: error.message });
  }
};
