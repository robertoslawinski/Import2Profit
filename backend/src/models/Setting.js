import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    desiredProfitMargin: { type: Number, default: 35 },
    defaultCurrency: { type: String, enum: ["EUR", "USD", "GBP", "CNY"], default: "EUR" },
    exchangeRatesToEur: {
      EUR: { type: Number, default: 1 },
      USD: { type: Number, default: 0.92 },
      GBP: { type: Number, default: 1.17 },
      CNY: { type: Number, default: 0.13 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
