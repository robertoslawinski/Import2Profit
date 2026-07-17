import { Router } from "express";
import { getReports } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getReports);

export default router;
