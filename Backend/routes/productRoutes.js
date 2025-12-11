import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";
import { isAdminOrEmployee, requireSignIn } from "../configs/authMiddleware.js";

// ROUTER OBJECT
const router = express.Router();

// ROUTING
// CREATE PRODUCT
router.post("/create-product", requireSignIn, isAdminOrEmployee, createProduct);

// GET PRODUCTS
router.get("/get-products", requireSignIn, isAdminOrEmployee, getProducts);

export default router;
