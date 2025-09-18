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

export const GET_MANUFACTURERS = gql`
  query GetManufacturers {
    manufacturers {
      id
      name
      country
      website
      description
      address
      contact {
        name
        email
        phone
      }
    }
  }
`;

export const ADD_MANUFACTURER = gql`
  mutation AddManufacturer($input: ManufacturerInput!) {
    addManufacturer(input: $input) {
      id
      name
      country
      website
      description
      address
      contact {
        id
        name
        email
        phone
      }
    }
  }
`;

export const UPDATE_MANUFACTURER = gql`
  mutation UpdateManufacturer($id: ID!, $input: UpdateManufacturerInput!) {
    updateManufacturer(id: $id, input: $input) {
      id
      name
      country
      website
      description
      address
      contact {
        id
        name
        email
        phone
      }
    }
  }
`;
