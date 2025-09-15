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
  input UpdateProductInput {
    name: String
    sku: String
    description: String
    price: Float
    category: String
    manufacturer: ID
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
  
  input UpdateManufacturerInput{
    name: String
    country: String
    website: String
    description: String
    address: String
    contact: UpdateContactInput
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
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Product

    addManufacturer(input: ManufacturerInput!): Manufacturer
    updateManufacturer(id: ID!, input: UpdateManufacturerInput!): Manufacturer
    deleteManufacturer(id: ID!): Manufacturer
    
    addContact(input: ContactInput!): Contact
    updateContact(id: ID!, input: UpdateContactInput!): Contact
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
    contact: Contact
  }
`;

