import { Categorymodel } from "../model/category.js";

export const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  try {
    const category = await Categorymodel.create({
      categoryName: categoryName,
    });
    res
      .status(200)
      .send({
        success: true,
        category: category,
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
export const getCategory = async (_, res) => {
  try {
    const categories = await Categorymodel.find();
    res.status(200).send(categories);
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

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await Categorymodel.findById(id);

  if (!category) {
    return res.status(404).send({
      success: false,
      message: "Category not found.",
    });
  }

  return res.status(200).send({ user: user });
};
export const deleteCategory = async (req, res) => {
  const { id } = req.body;
  const categories = await Categorymodel.findByIdAndDelete(id);
  res.status(200).send({
    success: true,
    message: "Amjilttai ustsan",
  });
  if (!categories) {
    return res.status(404).send({
      success: false,
      message: "User not found.",
    });
  }
};
export const updateCategory = async (req, res) => {
  const { id, categoryName } = req.body;

  try {
    const categories = await Categorymodel.findById(id);
    if (!categories) {
      return res.status(404).send({
        success: false,
        message: "Category not found.",
      });
    }

    if (categoryName !== undefined) categories.categoryName = categoryName;

    await categories.save();

    return res.status(200).send({
      success: true,
      message: "Category updated successfully.",
      categories,
    });
  } catch (error) {
    console.log(error, "UPDATE ERROR");
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
