import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      description
      price
      category
      # Todo: populate product with manufacturer?
      # manufacturer {
      #   name
      # }
      amountInStock
    }
  }
`;
