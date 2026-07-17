import { Router } from "express";
import { body } from "express-validator";
import { createImportOrder, distributeImportOrderCosts, listImportOrders, updateImportOrder } from "../controllers/importOrderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(protect);
router.get("/", listImportOrders);
router.post("/", [body("orderNumber").notEmpty()], validateRequest, createImportOrder);
router.put("/:id", updateImportOrder);
router.post("/:id/distribute-costs", distributeImportOrderCosts);

export default router;
