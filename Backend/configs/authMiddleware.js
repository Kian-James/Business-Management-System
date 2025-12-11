import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ROUTE PROTECTOR TOKEN
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Unauthorized access, token is missing or invalid",
      error: error.message,
    });
  }
};

// ADMIN ONLY
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user || user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UNAUTHORIZED ACCESS: Admins only",
      });
    }

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in Admin Middleware",
      error,
    });
  }
};

// USER / EMPLOYEE ONLY
export const isEmployee = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user || user.role !== "user") {
      return res.status(401).send({
        success: false,
        message: "UNAUTHORIZED ACCESS: Users only",
      });
    }

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in Employee Middleware",
      error,
    });
  }
};

export const isAdminOrEmployee = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user || (user.role !== "admin" && user.role !== "user")) {
      return res.status(401).send({
        success: false,
        message: "UNAUTHORIZED ACCESS: Admins or Users only",
      });
    }

    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in Role Middleware",
      error: error.message,
    });
  }
};
