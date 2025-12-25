import mongoose from "mongoose";

export const personalUseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    products: [productSchema],

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false, timestamps: false }
);
