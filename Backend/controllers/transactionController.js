import transactionModel from "../models/transactionModel.js";
import productListModel from "../models/productListModel.js";

export const createTransactionController = async (req, res) => {
  try {
    const {
      customer_name,
      customer_address,
      customer_phone,
      products,
      discount = 0,
      transaction_date,
    } = req.body;

    // ✅ Validate inputs
    if (
      !customer_name ||
      !customer_address ||
      !customer_phone ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const productCodes = products.map((p) => p.product_code);

    const dbProducts = await productListModel.find({
      product_code: { $in: productCodes },
    });

    const productMap = new Map(dbProducts.map((p) => [p.product_code, p]));

    let total = 0;

    const productsWithTotal = products.map((p) => {
      const dbProduct = productMap.get(p.product_code);

      if (!dbProduct) {
        throw new Error(`Product not found: ${p.product_code}`);
      }

      if (dbProduct.stock < p.quantity) {
        throw new Error(`Not enough stock for ${dbProduct.product_name}`);
      }

      const total_price = p.quantity * p.product_price;
      total += total_price;

      return {
        ...p,
        total_price,
      };
    });

    const discounted_total = total - (total * discount) / 100;

    let formattedDate;
    if (transaction_date) {
      const d = new Date(transaction_date);
      formattedDate = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
        d.getDate()
      ).padStart(2, "0")}/${d.getFullYear()}`;
    }

    const transaction = await transactionModel.create({
      customer_name,
      customer_address,
      customer_phone,
      products: productsWithTotal,
      total,
      discount,
      discounted_total,
      grand_total: discounted_total,
      ...(formattedDate && { transaction_date: formattedDate }),
    });

    const bulkUpdates = products.map((p) => ({
      updateOne: {
        filter: { product_code: p.product_code },
        update: { $inc: { stock: -p.quantity } },
      },
    }));

    await productListModel.bulkWrite(bulkUpdates);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    console.error("❌ Error creating transaction:", err.message);

    res.status(400).json({
      message: err.message || "Server error creating transaction",
    });
  }
};

export const getAllTransactionsController = async (req, res) => {
  try {
    const transactions = await transactionModel
      .find()
      .sort({ delivery_receipt_number: -1 })
      .lean();

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({
      message: "Server error fetching transactions",
    });
  }
};

/**
 * Get today's transactions
 */
export const getTodayTransactionsController = async (req, res) => {
  try {
    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const transactions = await transactionModel
      .find({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      })
      .sort({ delivery_receipt_number: -1 })
      .lean();

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching today's transactions:", err);
    res.status(500).json({
      message: "Server error fetching today's transactions",
    });
  }
};
