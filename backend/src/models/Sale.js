import mongoose from "mongoose";
import { roundMoney, toNumber } from "../utils/calculations.js";

const saleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    marketplace: { type: String, enum: ["Vinted", "eBay", "Amazon Seller", "Wallapop", "OLX", "Other"], required: true },
    saleDate: { type: Date, default: Date.now },
    salePrice: { type: Number, required: true },
    marketplaceFee: { type: Number, default: 0 },
    shippingChargedToBuyer: { type: Number, default: 0 },
    shippingPaidBySeller: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "returned", "cancelled"], default: "processing" },
    netProfit: { type: Number, default: 0 },
    customerCountry: { type: String, trim: true },
    notes: String
  },
  { timestamps: true }
);

saleSchema.pre("save", async function calculateNetProfit(next) {
  await this.populate("product");
  const totalProductCost = toNumber(this.product?.totalCost);
  this.netProfit = roundMoney(
    toNumber(this.salePrice) +
      toNumber(this.shippingChargedToBuyer) -
      totalProductCost -
      toNumber(this.marketplaceFee) -
      toNumber(this.shippingPaidBySeller)
  );
  next();
});

export default mongoose.model("Sale", saleSchema);
