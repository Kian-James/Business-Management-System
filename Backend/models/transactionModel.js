import mongoose from "mongoose";
import SequenceFactory from "mongoose-sequence";
const AutoIncrement = SequenceFactory(mongoose);
import productSchema from "./productModel";

const transactionSchema = new mongoose.Schema(
  {
    delivery_receipt_number: {
      type: Number,
      unique: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_address: {
      type: String,
      required: true,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    products: {
      type: [productSchema],
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discounted_total: {
      type: Number,
      default: 0,
    },
    grand_total: {
      type: Number,
      default: 0,
    },
    transaction_date: {
      type: String,
      default: () => {
        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
      },
    },
    is_voided: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

transactionSchema.plugin(AutoIncrement, {
  inc_field: "delivery_receipt_number",
});

export default mongoose.model("transactions", transactionSchema);
