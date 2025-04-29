import jwt from "jsonwebtoken";
const secret_key = process.env.SECRET_KEY;

export const verifytoken = (req, res, next) => {
  const token = req.headers.authorization;
  const splitted = token.split(" ")[1];
  const decode = jwt.decode(splitted, secret_key);
  req.body = { ...req.body, userData: decode._doc };
  console.log(req.body, "body");
  next();
};
