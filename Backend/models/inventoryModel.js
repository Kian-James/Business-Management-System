import mongoose from "mongoose";
import { productSchema } from "./productSchema.js";

const inventoryTransactionsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },

    products: [productSchema],

    total: { type: Number, required: true },
    discounted_amount: { type: Number, default: 0 },
    grand_total: { type: Number, required: true },

    transaction_date: {
      type: String,
      default: () => {
        const d = new Date();
        return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
          d.getDate()
        ).padStart(2, "0")}/${d.getFullYear()}`;
      },
    },

    is_voided: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventoryTransactionsSchema);
