import product from "./resolvers/product.js";
import manufacturer from "./resolvers/manufacturer.js";
import contact from "./resolvers/contact.js";
import Manufacturer from "../models/Manufacturer.js";

export default {
  Query: {
    products: product.getAll,
    lowStockProducts: product.getLowStock,
    criticalStockProducts: product.getCriticalStock,
    totalStockValue: product.getStockValue,
    totalStockValueByManufacturer: product.getStockValueByManufacturer,
    product: product.getById,
    manufacturers: manufacturer.getAll,
    manufacturer: manufacturer.getById,
    contacts: contact.getAll,
    contact: contact.getById,
  },

  Mutation: {
    // Products
    addProduct: product.add,
    updateProduct: product.updateById,
    deleteProduct: product.deleteById,

    // Manufacturers
    addManufacturer: manufacturer.add,
    updateManufacturer: manufacturer.updateById,
    deleteManufacturer: manufacturer.deleteById,
  },

  Product: {
    id: (doc) => String(doc._id),
    isLowStock: (doc) => (doc.amountInStock < 10 ? true : false),
    isCriticalStock: (doc) => (doc.amountInStock < 5 ? true : false),
    manufacturer: async (doc) => {
      if (!doc.manufacturer) return null;
      return await Manufacturer.findById(doc.manufacturer).populate("contact");
    },
  },

  Manufacturer: {
    id: (doc) => String(doc._id),
  },

  Contact: {
    id: (doc) => String(doc._id),
  },
};
