import express from "express";
import {
  isAdmin,
  requireSignIn,
  isAdminOrEmployee,
  isEmployee,
} from "../configs/authMiddleware.js";
import {
  deleteUserController,
  getUser,
} from "../controllers/userController.js";

// ROUTER OBJECT
const router = express.Router();

// ROUTING
// CREATE EXPENSE || METHOD POST
router.post("/get-users", requireSignIn, isAdmin, getUser);

// DELETE EXPENSE || METHOD DELETE
router.delete(
  "/delete-expense/:id",
  requireSignIn,
  isAdmin,
  deleteUserController
);

export default router;
