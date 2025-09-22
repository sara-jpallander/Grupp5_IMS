import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($page: Int, $limit: Int) {
    products(page: $page, limit: $limit) {
      items {
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
      totalCount
      hasNextPage
    }
  }
`;

export const GET_MANUFACTURERS = gql`
  query GetManufacturers($page: Int, $limit: Int) {
    manufacturers(page: $page, limit: $limit) {
      items {
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
      totalCount
      hasNextPage
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
