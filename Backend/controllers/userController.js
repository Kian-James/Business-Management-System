import userModel from "../models/userModel";

// GET USER LIST
export const getUser = async (req, res) => {
  try {
    // Fetch user with allowed roles (0, 1, 2)
    const user = await userModel
      .find({ role: { $in: [0, 1, 2] } })
      .sort({ user_id: 1 })
      .select("-password -__v");

    if (!user || user.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No User found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      total: user.length,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).send({
      success: false,
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Validate request body
    if (!user_id) {
      return res.status(400).send({
        success: false,
        message: "user ID is required.",
      });
    }

    // Attempt to find and delete the user
    const deletedUser = await userModel.findOneAndDelete({ user_id });

    // If no user was found
    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "user not found.",
      });
    }

    // Success
    res.status(200).send({
      success: true,
      message: `User '${deletedUser.name}' deleted successfully.`,
      deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).send({
      success: false,
      message: "Server error while deleting user.",
      error: error.message,
    });
  }
};
