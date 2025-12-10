import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/aControl.js";
import connectDB from "../configs/database.js";

// ROUTER OBJECT
const router = express.Router();

// ROUTING
// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

export default router;
