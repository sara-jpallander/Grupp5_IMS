import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import Product from "../../models/Product.js";
import { z } from "zod";
import { productSchema } from "../../validation/product.schema.js";

const idSchema = z.string().length(24, "Invalid id format");

const getAll = async (_p) => {
  return await Product.find();
};

const getById = async (_p, { id }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const product = await Product.findById(id);

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  return product;
};

const add = async (_p, { input }) => {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(
      "Validation failed: " + JSON.stringify(parsed.error.errors)
    );
  }
  parsed.data.manufacturer = new mongoose.Types.ObjectId(
    parsed.data.manufacturer
  );
  const product = await Product.create(parsed.data);
  return product;
};

const updateById = async (_p, { id, input }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const parsed = productSchema.partial().safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(
      "Validation failed: " + JSON.stringify(parsed.error.errors)
    );
  }
  const updated = await Product.findByIdAndUpdate(id, parsed.data, {
    runValidators: true,
    new: true,
  });
  if (!updated) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }
  return updated;
};

const deleteById = async (_p, { id }) => {
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new GraphQLError(
      "Invalid id: " + JSON.stringify(parsedId.error.errors)
    );
  }
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" },
    });
  }

  return product;
};

const getStockValue = async (_p) => {
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
};

const getStockValueByManufacturer = async (_p) => {
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
        id: "$manufacturerInfo._id",
        name: "$manufacturerInfo.name",
        location: "$manufacturerInfo.location",
        contactEmail: "$manufacturerInfo.contactEmail",
        website: "$manufacturerInfo.website",
        totalStock: 1,
        totalStockValue: 1,
      },
    },
  ]);

  return result;
};

const getLowStock = async (_p) => {
  const result = await Product.aggregate([
    { $match: { amountInStock: { $lt: 10 } } },
  ]);

  return result;
};

const getCriticalStock = async (_p) => {
  try {
    const result = await Product.aggregate([
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
    ]);
    return result;
  } catch (error) {
    console.log("ERROOOOOR");
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
