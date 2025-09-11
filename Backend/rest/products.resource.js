import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// ROUTES
router.get(
  "/total-stock-value-by-manufacturer",
  getTotalStockValueByManufacturer
);
router.get("/total-stock-value", getTotalStockValue);
router.get("/low-stock", getLowStock);
router.get("/critical-stock", getCriticalStock);

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

//CREATE
async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ message: "Products created: ", data: product });
  } catch (error) {
    res.status(500).json({ error });
  }
}

//GET ALL
async function getAllProducts(req, res) {
  try {
    /* TODO: ska man fixa filter med regexp här? */
    const products = await Product.find();

    res.status(200).json({ message: "All products: ", data: products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products: ", error });
  }
}

//GET BY ID
async function getProduct(req, res) {
  try {
    const product = await Contact.findById(req.params.id);

    if (!product)
      return res.status(404).json({ error: "Product could not be found." });

    res
      .status(200)
      .json({ message: "Successfully retrieved product.", data: product });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product.", error });
  }
}

//UPDATE BY ID
async function updateProduct(req, res) {
  try {
    const product = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product)
      return res.status(404).json({ error: "Could not find product." });

    res
      .status(200)
      .json({ message: "Successfully updated product.", data: product });
  } catch (error) {
    res.status(500).json({ error });
  }
}

//DELETE BY ID
async function deleteProduct(req, res) {
  try {
    const deleteProductById = await Contact.findByIdAndDelete(req.params.id);

    if (!deleteProductById) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Deleted product by ID", data: deleteProductById });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error. Failed to delete product by ID.",
        error,
      });
  }
}

async function getTotalStockValue(req, res) {
  try {
    const allProducts = await Product.aggregate([
      {
        $project: {
          stockValue: {
            $multiply: ["$price", "$amountInStock"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: "$stockValue" },
        },
      },
    ]);
    res
      .status(200)
      .json({ data: { totalStock: allProducts[0]?.totalStockValue || 0 } });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error. Failed to retrieve total stock value.",
        error,
      });
  }
}

async function getTotalStockValueByManufacturer(req, res) {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: "$manufacturer",
          totalStock: { $sum: "$amountInStock" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$amountInStock"] },
          },
        },
      },
      {
        $lookup: {
          from: "manufacturers",
          localField: "_id",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      {
        $unwind: "$manufacturerInfo",
      },
      {
        $project: {
          _id: "$manufacturerInfo._id",
          name: "$manufacturerInfo.name",
          location: "$manufacturerInfo.location",
          contactEmail: "$manufacturerInfo.contactEmail",
          website: "$manufacturerInfo.website",
          totalStock: 1,
          totalStockValue: 1,
        },
      },
    ]);

    res.status(200).json({ data: result });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "Internal server error. Failed to retrieve stock value by manufacturer.",
        error: error.message,
      });
  }
}

async function getLowStock(req, res) {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $lt: 10 }} },
    ]);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500)
      .json({
        message:
          "Internal server error. Failed to retrieve low stock.",
        error: error.message,
      });
  }
}

async function getCriticalStock(req, res) {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $lt: 5 }} },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturerInfo",
        },
      },
      { $unwind: "$manufacturerInfo" },
      {
        $lookup: {
          from: "contacts",
          localField: "manufacturerInfo.contact",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          name: "$name",
          sku: "$sku",
          price: "$price",
          amountInStock: "$amountInStock",
          manufacturer: "$manufacturerInfo.name",
          contact: {
            name: "$contactInfo.name",
            phone: "$contactInfo.phone",
            email: "$contactInfo.email"
          }
        },
      },
    ]);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500)
      .json({
        message:
          "Internal server error. Failed to retrieve critical stock.",
        error: error.message,
      });
  }
}

export default router;
