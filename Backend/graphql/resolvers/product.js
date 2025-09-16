import mongoose from "mongoose";
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

const addProduct = async (_p, { input }) => {
  input.manufacturer = new mongoose.Types.ObjectId(input.manufacturer);
  const product = await Product.create(input);
  return product;
}

const updateProduct = async (_p, { id, input }) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new GraphQLError("Product not found", {
      extensions: { code: "404_NOT_FOUND" }
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, input, {
      runValidation: true,
      new: true
    });


  return updatedProduct;
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
  addProduct,
  updateProduct,
  deleteProduct
};
