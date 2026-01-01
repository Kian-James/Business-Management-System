import express from "express";
import {
  isAdmin,
  requireSignIn,
  isAdminOrEmployee,
  isEmployee,
} from "../configs/authMiddleware.js";

import {
  createTransactionController,
  getAllTransactionsController,
  getTodayTransactionsController,
} from "../controllers/transactionController.js";

// ROUTER OBJECT
const router = express.Router();

// ROUTING
// CREATE TRANSACTION|| METHOD POST
router.post(
  "/create-transaction",
  requireSignIn,
  isAdminOrEmployee,
  createTransactionController
);

router.get(
  "/get-all-transactions",
  requireSignIn,
  isAdminOrEmployee,
  getAllTransactionsController
);

router.get(
  "/get-transaction-today",
  requireSignIn,
  isEmployee,
  getTodayTransactionsController
);

export default router;
