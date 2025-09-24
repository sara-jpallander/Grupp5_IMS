# Queries and Mutations

## Queries

### products (paginated)

```graphql
query GetProducts {
  products(sortBy: NAME_ASC, search: "Awesome", limit: 10, page: 1) {
    items {
      id
      name
      sku
      category
      description
      manufacturer
      price
      amountInStock
    }
    totalCount
    hasNextPage
  }
}
```

### product(id: ID!)

```graphql
query GetProduct {
  product(id: "68d159fcf5d20c3de25f0434") {
      id
      name
      sku
      category
      description
      manufacturer
      price
      amountInStock
  }
}
```

### totalStockValue

```graphql
query GetTotalStockValue {
  totalStockValue
}
```


### totalStockValueByManufacturer (paginated)

```graphql
query GetStockValueByManufacturer {
  totalStockValueByManufacturer(limit: 10, page: 1) {
    items {
      id
      name
      website
      country
      totalStock
      totalStockValue
    }
    totalCount
    hasNextPage
  }
}
```

### lowStockProducts

```graphql
query GetLowStock {
  lowStockProducts {
    id
    name
    amountInStock
  }
}
```

### criticalStockProducts

```graphql
query GetProductCriticalStock {
  criticalStockProducts(limit: 10, page: 1) {
    items {
      id
      name
      sku
      price
      amountInStock
      manufacturer
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
```


### manufacturers (paginated)

```graphql
query GetManufacturers {
  manufacturers(limit: 10, page: 1, search: "Dickinson") {
    items {
      id
      name
      website
      country
      address
      description
      contact {
        id
        name
        email
        phone
      }
    }
    totalCount
    hasNextPage
  }
}
```

***

## Mutations

### addProduct

```graphql
mutation AddProduct {
  addProduct(input: {
    name: "FINPUTS dish rags"
    sku: "BRD-123456"
    category: "Cleaning"
    description: "Premium cleaning supplies"
    price: 4
    amountInStock: 300
    manufacturer: "68d159fcf5d20c3de25efc3f"
  }) {
    id
    name
    sku
    category
    description
    price
    amountInStock
    manufacturer
  }
}
```

### updateProduct

```graphql
mutation UpdateProduct {
  updateProduct(id: "68d16f6735ceaffdd9517955", input: {
    name: "FINPUTS dish rags x10"
    amountInStock: 150
  }) {
    id
    name
    sku
    amountInStock
  }
}
```

### deleteProduct

```graphql
mutation DeleteProduct {
  deleteProduct(id: "68d16f6735ceaffdd9517955") {
    name
    sku
  }
}
```

### addManufacturer

```graphql
mutation AddManufacturer {
  addManufacturer(input: {
    name: "IKEA"
    country: "Sweden"
    website: "https://www.ikea.com"
    description: "Furniture company"
    address: "Ikeagatan 1"
    contact: {
      name: "Ingvar Kamprad"
      email: "ingvar@ikea.se"
      phone: "+4612345678"
    }
  }) {
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
```
