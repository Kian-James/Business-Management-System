import mongoose from "mongoose";

const productListSchema = new mongoose.Schema({
  product_code: {
    type: String,
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
  price_per_case: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
  },
  variant: {
    type: String,
  },
  itemclass: {
    type: String,
  },
  msl: {
    type: String,
  },
  weight: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

export default mongoose.model("product_list", productListSchema);
