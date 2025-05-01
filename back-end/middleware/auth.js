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
export const resettoken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).send({ message: "Forbidden: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret_key);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
  }
};
