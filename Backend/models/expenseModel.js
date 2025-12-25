import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  expense_name: {
    type: String,
    required: true,
    trim: true,
  },
  expense_cost: {
    type: Number,
    required: true,
  },
  expense_date: {
    type: String,
    default: () => {
      const date = new Date();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    },
  },
  category: {
    type: String,
    enum: ["Roel's", "Mekeni"],
    required: true,
  },
});

export default mongoose.model("expenses", expenseSchema);
