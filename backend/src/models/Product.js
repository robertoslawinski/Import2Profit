import mongoose from "mongoose";
import { calculateProductMetrics } from "../utils/calculations.js";

const productSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    brand: { type: String, trim: true },
    gender: { type: String, enum: ["men", "women", "kids", "unisex"], default: "unisex" },
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    supplier: { type: String, trim: true },
    supplierCountry: { type: String, trim: true },
    purchaseLink: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    purchaseDate: Date,
    status: {
      type: String,
      enum: ["ordered", "in_transit", "received", "listed", "sold", "returned", "lost"],
      default: "ordered"
    },
    acquisitionCost: { type: Number, default: 0 },
    internationalShippingCost: { type: Number, default: 0 },
    customsDuties: { type: Number, default: 0 },
    vatTaxes: { type: Number, default: 0 },
    marketplaceFees: { type: Number, default: 0 },
    packagingCost: { type: Number, default: 0 },
    otherCosts: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
    listedMarketplace: { type: String, enum: ["Vinted", "eBay", "Amazon Seller", "Wallapop", "OLX", "Other", ""], default: "" },
    listingPrice: { type: Number, default: 0 },
    finalSellingPrice: { type: Number, default: 0 },
    estimatedProfit: { type: Number, default: 0 },
    realProfit: { type: Number, default: 0 },
    profitMarginPercentage: { type: Number, default: 0 },
    breakEvenPrice: { type: Number, default: 0 },
    suggestedResalePrice: { type: Number, default: 0 },
    roi: { type: Number, default: 0 },
    currency: { type: String, enum: ["EUR", "USD", "GBP", "CNY"], default: "EUR" },
    conversionRateToEur: { type: Number, default: 1 },
    priceHistory: [
      {
        price: Number,
        marketplace: String,
        changedAt: { type: Date, default: Date.now },
        note: String
      }
    ],
    notes: String
  },
  { timestamps: true }
);

productSchema.index({ user: 1, sku: 1 }, { unique: true });

productSchema.pre("save", function calculateBeforeSave(next) {
  const metrics = calculateProductMetrics(this, this.$locals.desiredProfitMargin);
  Object.assign(this, metrics);
  next();
});

export default mongoose.model("Product", productSchema);
