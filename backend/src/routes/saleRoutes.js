import { Router } from "express";
import { body } from "express-validator";
import { createSale, listSales, updateSale } from "../controllers/saleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(protect);
router.get("/", listSales);
router.post("/", [body("product").notEmpty(), body("marketplace").notEmpty(), body("salePrice").isNumeric()], validateRequest, createSale);
router.put("/:id", updateSale);

export default router;
