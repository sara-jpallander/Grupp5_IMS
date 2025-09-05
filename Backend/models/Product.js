import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  // Extra uppgift: Gör category till en egen model för att hantera olika kategorier?
  category: {
    type: String,
  },
  manufacturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true
  },
  amountInStock: {
    type: Number,
    default: 0
  }
}, { collection: "products" });

export default mongoose.model("Product", ProductSchema);
