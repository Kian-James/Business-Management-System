import mongoose from "mongoose";

const voidInventoryTransactionSchema = new mongoose.Schema(
  {
    stock_transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },

    void_reason: {
      type: String,
      required: true,
      trim: true,
    },

    voided_at: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "void_inventory_transaction",
  voidInventoryTransactionSchema
);
