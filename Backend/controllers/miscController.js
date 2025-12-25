export const expenseController = async (req, res) => {
  try {
    const { expense_name, expense_cost, category, expense_date } = req.body;

    // VALIDATION
    if (!expense_name) {
      return res
        .status(400)
        .send({ success: false, message: "Expense Name is required" });
    }
    if (!expense_cost) {
      return res
        .status(400)
        .send({ success: false, message: "Expense Cost is required" });
    }
    if (!expense_date) {
      return res
        .status(400)
        .send({ success: false, message: "Expense Date is required" });
    }

    // SAVE TO DATABASE
    const expense = await new expenseModel({
      expense_name,
      expense_cost,
      category, // optional if present in schema
      expense_date, // add date here
    }).save();

    res.status(201).send({
      success: true,
      message: "Expense listed successfully",
      expense,
    });
  } catch (error) {
    console.error("Error saving expense:", error);
    res.status(500).send({
      success: false,
      message: "Failed to list expense",
      error: error.message,
    });
  }
};

// GET EXPENSE LIST
export const getExpense = async (req, res) => {
  try {
    const expense = await expenseModel.find({});
    res.status(200).send({
      success: true,
      message: "Expenses fetched successfully",
      expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching expense",
      error,
    });
  }
};
