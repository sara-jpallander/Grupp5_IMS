import express from "express";
import Product from "../models/Product.js";
import { z } from "zod";
import { productSchema } from "../validation/product.schema.js";

const idSchema = z.string().length(24, "Invalid id format");

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
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: parsed.error.errors });
    }
    const product = await Product.create(parsed.data);
    res.status(201).json({ message: "Product created", data: product });
  } catch (error) {
    res.status(500).json({ error });
  }
}

//GET ALL
async function getAllProducts(req, res) {
  const search = req.query.search || "";
  const sortBy = req.query.sortBy || "";
  const limit = Number(req.query.limit) || 0;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  let sort = {};

  // Sorting options
  switch (sortBy) {
    case "NAME_ASC":
      sort = { name: 1 };
      break;
    case "PRICE_ASC":
      sort = { price: 1 };
      break;
    case "PRICE_DESC":
      sort = { price: -1 };
      break;
    case "STOCK_ASC":
      sort = { amountInStock: 1 };
      break;
    case "STOCK_DESC":
      sort = { amountInStock: -1 };
      break;
    default:
      sort = { name: 1 };
  }

  const filter = {};

  // Filter by search term
  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  try {
    let query = Product.find(filter).sort(sort);

    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const [items, totalCount] = await Promise.all([
      query,
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      message: "All products: ",
      data: items,
      totalCount,
      hasNextPage: limit > 0 ? skip + items.length < totalCount : false,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products: ", error });
  }
}

//GET BY ID
async function getProduct(req, res) {
  // Validate ID parameter
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res
      .status(400)
      .json({ error: "Invalid ID format", details: parsedId.error.errors });
  }
  try {
    const product = await Product.findById(req.params.id);

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
  // Validate ID parameter
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res
      .status(400)
      .json({ error: "Invalid ID format", details: parsedId.error.errors });
  }
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.errors });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      parsed.data,
      { new: true }
    );
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
  // Validate ID parameter
  const parsedId = idSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    return res
      .status(400)
      .json({ error: "Invalid ID format", details: parsedId.error.errors });
  }
  try {
    const deleteProductById = await Product.findByIdAndDelete(req.params.id);

    if (!deleteProductById) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Deleted product by ID", data: deleteProductById });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      message: "Internal server error. Failed to retrieve total stock value.",
      error,
    });
  }
}

async function getTotalStockValueByManufacturer(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 0;
  const skip = (page - 1) * limit;

  try {
    const basePipeline = [
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
    ];

    // Get all results for totalCount
    const allResults = await Product.aggregate(basePipeline);
    const totalCount = allResults.length;

    // Add pagination if limit > 0
    let items;
    if (limit > 0) {
      const paginatedPipeline = [
        ...basePipeline,
        { $skip: skip },
        { $limit: limit },
      ];
      items = await Product.aggregate(paginatedPipeline);
    } else {
      items = allResults;
    }

    res.status(200).json({
      data: {
        items,
        totalCount,
        hasNextPage: skip + items.length < totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Internal server error. Failed to retrieve stock value by manufacturer.",
      error: error.message,
    });
  }
}

async function getLowStock(req, res) {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $lt: 10 } } },
    ]);

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to retrieve low stock.",
      error: error.message,
    });
  }
}

async function getCriticalStock(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 0;
  const skip = (page - 1) * limit;

  try {
    const basePipeline = [
      { $match: { amountInStock: { $lt: 5 } } },
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
            email: "$contactInfo.email",
          },
        },
      },
    ];

    let items;
    if (limit > 0) {
      const paginatedPipeline = [
        ...basePipeline,
        { $skip: skip },
        { $limit: limit },
      ];
      items = await Product.aggregate(paginatedPipeline);
    } else {
      items = await Product.aggregate(basePipeline);
    }

    const totalCount = await Product.countDocuments({
      amountInStock: { $lt: 5 },
    });

    res.status(200).json({
      data: {
        items,
        totalCount,
        hasNextPage: limit > 0 ? skip + items.length < totalCount : false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error. Failed to retrieve critical stock.",
      error: error.message,
    });
  }
}

export default router;
