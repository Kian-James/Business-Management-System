import express from "express";
import {
  expenseController,
  getExpense,
} from "../controllers/miscController.js";
import {
  isAdmin,
  requireSignIn,
  isAdminOrEmployee,
  isEmployee,
} from "../configs/authMiddleware.js";

// ROUTER OBJECT
const router = express.Router();

// ROUTING
// REGISTER || METHOD POST
router.post("/create-expense", requireSignIn, isAdmin, expenseController);

// LOGIN || POST
router.post("/get-expense", requireSignIn, isAdmin, getExpense);

export default router;
