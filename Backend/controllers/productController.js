import productListModel from "../models/productListModel.js";

// --- POST: CREATE PRODUCT ---
export const createProduct = async (req, res) => {
  try {
    let {
      product_code,
      product_name,
      product_price,
      price_per_case,
      brand,
      variant,
      itemclass,
      msl,
      weight,
      discount,
    } = req.body;

    if (!product_name || !product_price) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const price = Number(product_price);
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Product price must be a valid positive number." });
    }

    let parsedCasePrice = null;
    if (price_per_case !== undefined && price_per_case !== "") {
      parsedCasePrice = Number(price_per_case);
      if (isNaN(parsedCasePrice) || parsedCasePrice < 0) {
        return res.status(400).json({
          message: "Price per case must be a valid non-negative number.",
        });
      }
    }

    let parsedWeight = null;
    if (weight !== undefined && weight !== null && weight !== "") {
      parsedWeight = Number(weight);
      if (isNaN(parsedWeight) || parsedWeight < 0) {
        return res
          .status(400)
          .json({ message: "Weight must be a valid non-negative number." });
      }
    }

    let parsedDiscount = 0;
    if (discount !== undefined && discount !== "") {
      parsedDiscount = Number(discount);
      if (isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
        return res.status(400).json({
          message: "Discount must be a valid number between 0 and 100.",
        });
      }
    }

    if (product_code && product_code.trim() !== "") {
      const existing = await productListModel.findOne({ product_code });
      if (existing) {
        return res.status(409).json({
          message: `Product code "${product_code}" already exists.`,
        });
      }
    } else {
      product_code = undefined;
    }

    const newProduct = new productListModel({
      product_code,
      product_name: product_name.trim(),
      product_price: price,
      price_per_case: parsedCasePrice,
      brand: brand?.trim() || "",
      variant: variant?.trim() || "",
      itemclass: itemclass?.trim() || "",
      msl: msl?.trim() || "",
      weight: parsedWeight,
      discount: parsedDiscount,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate product code detected.",
      });
    }

    res.status(500).json({
      message: "Server error while creating product.",
    });
  }
};

// --- GET: Fetch all products ---
export const getProducts = async (req, res) => {
  try {
    const products = await productListModel.find().select("-__v");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server error while fetching products.",
    });
  }
};
