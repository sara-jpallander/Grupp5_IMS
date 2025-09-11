import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    name
    sku
    description
    price
    category
    # manufacturer
    amountInStock
  }
`;
