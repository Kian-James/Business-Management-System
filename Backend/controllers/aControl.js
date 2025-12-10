import userModel from "../models/userModel";
import JWT from "jsonwebtoken";

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
      role: Number(role),
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
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not Registered, Kindly Register",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // GENERATE JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (message) {
    console.log(message);
    res.status(500).send({
      success: false,
      message: "message in Login",
      message,
    });
  }
};

// CHECK-EMAIL
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
