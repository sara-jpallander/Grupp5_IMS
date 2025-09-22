export default `#graphql

  type Product {
    id: ID!
    name: String!
    sku: String!
    description: String
    price: Float
    category: String
    manufacturer: ID!
    amountInStock: Int
    isLowStock: Boolean
    isCriticalStock: Boolean
  }

  type CriticalStockProduct {
    id: ID!
    name: String!
    sku: String!
    price: Float
    amountInStock: Int
    manufacturer: String
    contact: Contact
  }

  type CriticalProductPage {
    items: [CriticalStockProduct!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  type ProductPage {
    items: [Product!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input ProductInput {
    name: String!
    sku: String!
    description: String
    price: Float
    category: String
    manufacturer: ID!
    amountInStock: Int
  }
  
  input UpdateProductInput {
    name: String
    sku: String
    description: String
    price: Float
    category: String
    manufacturer: ID
    amountInStock: Int
  }

  type Manufacturer {
    id: ID!
    name: String!
    country: String
    website: String
    description: String
    address: String
    contact: Contact
  }

  type ManufacturerPage {
    items: [Manufacturer!]!
    totalCount: Int!
    hasNextPage: Boolean!
  }

  input ManufacturerInput{
    name: String!
    country: String
    website: String
    description: String
    address: String
    contact: ContactInput
  }
  
  input UpdateManufacturerInput {
    name: String
    country: String
    website: String
    description: String
    address: String
    contact: UpdateContactInput
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
  }

  input ContactInput {
      name: String!
      phone: String!
      email: String!
  }

  input UpdateContactInput {
    name: String
    phone: String
    email: String
  }
  
  type StockValueByManufacturer {
    id: ID
    name: String
    country: String
    website: String
    totalStock: Int
    totalStockValue: Float
  }
  
  enum ProductSortOption {
    NAME_ASC
    PRICE_ASC
    PRICE_DESC
    STOCK_ASC
    STOCK_DESC
  }

  type Query {
    products(page: Int = 1, limit: Int = 10, sortBy: ProductSortOption = NAME_ASC, search: String): ProductPage!
    product(id: ID!): Product
    stockValue: Float
    stockValueByManufacturer: [StockValueByManufacturer]
    productLowStock: [Product]
    productCriticalStock(page: Int = 1, limit: Int = 10): CriticalProductPage!

    manufacturers(page: Int = 1, limit: Int = 10, search: String): ManufacturerPage!
    manufacturer(id: ID!): Manufacturer

    contacts: [Contact]
    contact(id: ID!): Contact
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Product

    addManufacturer(input: ManufacturerInput!): Manufacturer
    updateManufacturer(id: ID!, input: UpdateManufacturerInput!): Manufacturer
    deleteManufacturer(id: ID!): Manufacturer
    
    addContact(input: ContactInput!): Contact
    updateContact(id: ID!, input: UpdateContactInput!): Contact
    deleteContact(id: ID!): Contact
  }
`;
