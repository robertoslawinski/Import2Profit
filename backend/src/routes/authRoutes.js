import { Router } from "express";
import { body } from "express-validator";
import { getProfile, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must have at least 8 characters")
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  login
);

router.get("/me", protect, getProfile);

export default router;
