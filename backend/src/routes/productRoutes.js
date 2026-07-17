import { Router } from "express";
import { body } from "express-validator";
import { calculateProduct, createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { uploadProductImage } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();

router.use(protect);
router.get("/", listProducts);
router.post("/calculate", calculateProduct);
router.post("/upload", upload.single("image"), uploadProductImage);
router.post("/", [body("name").notEmpty(), body("sku").notEmpty()], validateRequest, createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
