import jwt from "jsonwebtoken";
import User from "../schema/UserSchema.js";

export const authorization = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );

    // User.findById(decoded.userId).select('-password')
    //     .then(user => {
    //       if (!user) {
    //         return res.status(401).json({
    //           success: false,
    //           message: 'Invalid token. User not found.'
    //         });
    //       }});

    const user = User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
