import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_code: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9-]+$/,
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
  municipality: {
    type: String,
    trim: true,
  },
  market_name: {
    type: String,
    trim: true,
  },
  channel_type: {
    type: String,
  },
  account_type: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  dsp: {
    type: String,
    trim: true,
    uppercase: true,
  },
});

export default mongoose.model("customer", customerSchema);
