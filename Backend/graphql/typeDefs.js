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
    location: String
    contactEmail: String
    website: String
    totalStock: Int
    totalStockValue: Float
  }
  
  type Query {
    products(page: Int = 1, limit: Int = 10): ProductPage!
    product(id: ID!): Product
    stockValue: Float
    stockValueByManufacturer: [StockValueByManufacturer]
    productLowStock: [Product]
    productCriticalStock: [Product]

    manufacturers(page: Int = 1, limit: Int = 10): ManufacturerPage!
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

