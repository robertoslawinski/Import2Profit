import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
