import product from "./resolvers/product.js";
import manufacturer from "./resolvers/manufacturer.js";
import contact from "./resolvers/contact.js"

export default {
    Query: {
        products: product.getAll,
        productLowStock: product.getLowStock,
        productCriticalStock: product.getCriticalStock,
        stockValue: product.getStockValue,
        stockValueByManufacturer: product.getStockValueByManufacturer,
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
      deleteManufacturer: manufacturer.deleteById
    },

    Product: {
      id: (doc) => String(doc._id),
      isLowStock: (doc) => doc.amountInStock < 10 ? true : false,
      isCriticalStock: (doc) => doc.amountInStock < 5 ? true : false,
    },

    Manufacturer: {
      id: (doc) => String(doc._id)
    },

    Contact: {
      id: (doc) => String(doc._id)
    },
}


