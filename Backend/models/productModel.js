import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_code: {
    type: String,
    required: true,
    unique: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

export default mongoose.model("Product", productSchema);
