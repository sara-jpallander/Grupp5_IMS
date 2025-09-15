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

  input ManufacturerInput{
    name: String!
    country: String
    website: String
    description: String
    address: String
    contact: ContactInput
  }

  input ContactInput {
      name: String!
      phone: String
      email: String!
  }
  
  type Query {
    products: [Product]
    product(id: ID!): Product
    manufacturers: [Manufacturer]
    manufacturer(id: ID!): Manufacturer
    contacts: [Contact]
    contact(id: ID!): Contact
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Product

    addManufacturer(input: ManufacturerInput!): Manufacturer
    updateManufacturer(id: ID!, input: ManufacturerInput!): Manufacturer
    deleteManufacturer(id: ID!): Manufacturer
    
    addContact(input: ContactInput!): Contact
    updateContact(id: ID!, input: ContactInput!): Contact
    deleteContact(id: ID!): Contact
  }

  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
  }

  type Manufacturer {
    id: ID!
    name: String!
    country: String
    website: String
    description: String
    address: String
    contact: ID!
  }
`;

