import mongoose from "mongoose";
import { distributeOrderCosts } from "../utils/calculations.js";

const importOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, required: true, trim: true },
    supplierOrAgent: { type: String, trim: true },
    countryOfOrigin: { type: String, trim: true },
    purchaseDate: Date,
    shippingMethod: { type: String, trim: true },
    trackingNumber: { type: String, trim: true },
    totalShippingCost: { type: Number, default: 0 },
    customsTaxCost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["preparing", "shipped", "in_customs", "delivered", "partially_received"],
      default: "preparing"
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        allocatedShippingCost: { type: Number, default: 0 },
        allocatedCustomsTaxCost: { type: Number, default: 0 }
      }
    ],
    notes: String
  },
  { timestamps: true }
);

importOrderSchema.methods.distributeCosts = async function distributeCosts(populatedProducts) {
  this.products = distributeOrderCosts(populatedProducts, this.totalShippingCost, this.customsTaxCost);
  return this.products;
};

export default mongoose.model("ImportOrder", importOrderSchema);
