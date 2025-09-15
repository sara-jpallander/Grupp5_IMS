import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "./resolvers/product.js";
import { getAllManufacturers, getManufacturerById, addManufacturer, updateManufacturer, deleteManufacturer } from "./resolvers/manufacturer.js";
import { getAllContacts, getAllContactsById } from "./resolvers/contact.js"

export default {
    Query: {
        products: getAllProducts,
        product: getProductById,
        manufacturers: getAllManufacturers,
        manufacturer: getManufacturerById,
        contacts: getAllContacts,
        contact: getAllContactsById,

    },
    
    Mutation: {
      // Products
      addProduct: createProduct,
      updateProduct: updateProduct,
      deleteProduct: deleteProduct,

      // Manufacturers
        addManufacturer: addManufacturer,
        updateManufacturer: updateManufacturer,
        deleteManufacturer: deleteManufacturer
    },

    Product: {
      id: (doc) => String(doc._id)
    },

    Manufacturer: {
      id: (doc) => String(doc._id)
    },

    Contact: {
      id: (doc) => String(doc._id)
    },
}


