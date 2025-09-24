import mongoose from "mongoose";
import Product from "../../models/Product.js";
import { z } from "zod";
import { productSchema } from "../../validation/product.schema.js";
import { GQLError, zodToBadInput } from "../../utils/errors.js";

const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (
  _p,
  { page = 1, limit = 0, sortBy = "NAME_ASC", search }
) => {
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

    return {
      items,
      totalCount,
      hasNextPage: limit > 0 ? skip + items.length < totalCount : false,
    };
  } catch (error) {
    throw GQLError.internal("Failed to retrieve products");
  }
};

const getById = async (_p, { id }) => {
  // Validate ID
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) throw zodToBadInput("Invalid id", parsedId.error);

  try {
    const product = await Product.findById(id);
    if (!product) throw GQLError.notFound("Product not found");

    return product;
  } catch (error) {
    throw GQLError.internal("Failed to get product by ID");
  }
};

const add = async (_p, { input }) => {
  // Validate input
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) throw zodToBadInput("Product validation failed", parsed.error);

  try {
    parsed.data.manufacturer = new mongoose.Types.ObjectId(
      parsed.data.manufacturer
    );
    const product = await Product.create(parsed.data);
    return product;
  } catch (error) {
    throw GQLError.internal("Failed to create product");
  }
};

const updateById = async (_p, { id, input }) => {
  // Validate ID
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) throw zodToBadInput("Invalid id", parsedId.error);

  const parsed = productSchema.partial().safeParse(input);
  if (!parsed.success) throw zodToBadInput("Product validation failed", parsed.error);
  try {
    const updated = await Product.findByIdAndUpdate(id, parsed.data, {
      runValidators: true,
      new: true,
    });

    if (!updated) throw GQLError.notFound("Product not found");
    return updated;
  } catch (error) {
    throw GQLError.internal("Failed to update product");
  }
};

const deleteById = async (_p, { id }) => {
  // Validate ID
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) throw zodToBadInput("Invalid id", parsedId.error);

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) throw GQLError.notFound("Product not found");

    return product;
  } catch (error) {
    throw GQLError.internal("Failed to delete product");
  }
};

const getStockValue = async (_p) => {
  try {
    const result = await Product.aggregate([
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
    return result[0].totalStockValue || 0;
  } catch (error) {
    throw GQLError.internal("Failed to retrieve total stock value");
  }
};

const getStockValueByManufacturer = async (_p, { page = 1, limit = 0 }) => {
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
      { $sort: { totalStockValue: -1 } },
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
          id: "$manufacturerInfo._id",
          name: "$manufacturerInfo.name",
          country: "$manufacturerInfo.country",
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
        { $limit: limit }
      ];
      items = await Product.aggregate(paginatedPipeline);
    } else {
      items = allResults;
    }

    return {
      items,
      totalCount,
      hasNextPage: skip + items.length < totalCount,
    };
  } catch (error) {
    throw GQLError.internal("Failed to retrieve stock value by manufacturer");
  }
};

const getLowStock = async (_p) => {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $lt: 10 } } },
    ]);
    return result;
  } catch (error) {
    throw GQLError.internal("Failed to retrieve low stock");
  }
};

const getCriticalStock = async (_p, { page = 1, limit = 0 }) => {
  try {
    const skip = (page - 1) * limit;
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
      { $sort: { amountInStock: 1 } },
      {
        $project: {
          id: "$_id",
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
        { $limit: limit }
      ];
      items = await Product.aggregate(paginatedPipeline);
    } else {
      items = await Product.aggregate(basePipeline);
    }

    const totalCount = await Product.countDocuments({ amountInStock: { $lt: 5 } });

    return {
      items,
      totalCount,
      hasNextPage: limit > 0 ? skip + items.length < totalCount : false,
    };
  } catch (error) {
    throw GQLError.internal("Failed to retrieve critical stock");
  }
};

export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
  getLowStock,
  getCriticalStock,
  getStockValue,
  getStockValueByManufacturer,
};
