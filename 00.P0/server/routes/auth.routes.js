import { Router } from "express";

import User from "../schema/UserSchema.js";
import { register, login } from "../controller/auth.controller.js";
import { authorization } from "../middleware/auth.js";
const router = Router();

router.post("/signup", register);
router.post("/login", login);

router.get("/profile", authorization, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
