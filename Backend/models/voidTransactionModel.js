import mongoose from "mongoose";

const voidTransactionSchema = new mongoose.Schema(
  {
    // Reference to the unified transaction model
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transactions",
      required: true,
    },

    // Reason for voiding the transaction
    void_reason: {
      type: String,
      required: true,
      trim: true,
    },

    // Timestamp when voided
    voided_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("void_transactions", voidTransactionSchema);
