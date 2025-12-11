import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../configs/authHelper.js";

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // VALIDATION
    if (!name || !email || !password) {
      return res.send({ success: false, message: "All fields are required." });
    }

    // CHECK EXISTING EMAIL
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.send({ success: false, message: "Email already registered." });
    }

    // VALID ROLE
    const allowedRoles = ["admin", "user"];
    const finalRole = allowedRoles.includes(role) ? role : "user";

    // HANDLE DUPLICATE NAMES
    let finalName = name.trim();
    let counter = 1;
    while (await userModel.findOne({ name: finalName })) {
      finalName = `${name.trim()}${counter}`;
      counter++;
    }

    // HASH PASSWORD
    const hashedPassword = await hashPassword(password);

    // SAVE USER
    const user = await new userModel({
      name: finalName,
      email,
      password: hashedPassword,
      role: finalRole,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully.",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration.",
      error,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATOR
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered.",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password.",
      });
    }

    // GENERATE JWT
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({
      success: false,
      message: "Error in login.",
      error,
    });
  }
};

// CHECK EMAIL
export const checkEmailController = async (req, res) => {
  try {
    const { email } = req.query;
    const existing = await userModel.findOne({ email });
    res.json({ exists: !!existing });
  } catch (error) {
    console.error("Email check error:", error);
    res.status(500).json({ exists: false, error: error.message });
  }
};

// UPDATE PASSWORD CONTROLLER
export const updatePasswordController = async (req, res) => {
  try {
    const { accountId, newPassword } = req.body;

    // VALIDATION
    if (!accountId || !newPassword) {
      return res
        .status(400)
        .send({ message: "Account ID and new password are required." });
    }

    // FIND USER
    const user = await accountModel.findOne({ account_id: accountId });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await hashPassword(newPassword);

    // UPDATE PASSWORD
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating password.",
      error,
    });
  }
};
