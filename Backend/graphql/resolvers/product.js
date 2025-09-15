import { GraphQLError } from "graphql";
import Product from "../../models/Product.js";

const getAllProducts = async (_p) => {
  return await Product.find();
}

const getProductById = async (_p, { id }) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" }
    });
  }

  return product;
}

const createProduct = async (_p, args) => {
  const product = await Product.create(args);

  // if (!product) {
  //   throw new GraphQLError("Failed to create product", {
  //     extensions: { code: "500_SERVER_ERROR" }
  //   });
  // }

  return product;
}

const updateProduct = async (_p, { id, ...args }) => {
  const product = await Product.findByIdAndUpdate(id, args, {
      runValidation: true,
      new: true
    });

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" }
    });
  }

  return product;
}

const deleteProduct = async (_p, { id }) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" }
    });
  }

  return product;
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
