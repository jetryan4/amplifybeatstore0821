/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      coverPhoto
      sampleAudio
      originalFile
      price
      orders {
        items {
          id
          productID
          orderID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      owner
      deleted
      createdAt
      updatedAt
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        coverPhoto
        sampleAudio
        originalFile
        price
        orders {
          nextToken
        }
        owner
        deleted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const productByOwner = /* GraphQL */ `
  query ProductByOwner(
    $owner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    productByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        description
        coverPhoto
        sampleAudio
        originalFile
        price
        orders {
          nextToken
        }
        owner
        deleted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      date
      email
      chargeId
      total
      products {
        items {
          id
          productID
          orderID
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        email
        chargeId
        total
        products {
          nextToken
        }
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const orderByOwner = /* GraphQL */ `
  query OrderByOwner(
    $owner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    orderByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        date
        email
        chargeId
        total
        products {
          nextToken
        }
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      email
      rating
      country
      gender
      genre
      picture
      role
      status
      stripeAccount
      stripeAccountStatus
      stripeSplitPercentage
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        email
        rating
        country
        gender
        genre
        picture
        role
        status
        stripeAccount
        stripeAccountStatus
        stripeSplitPercentage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByEmail = /* GraphQL */ `
  query UserByEmail(
    $email: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByEmail(
      email: $email
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        lastName
        email
        rating
        country
        gender
        genre
        picture
        role
        status
        stripeAccount
        stripeAccountStatus
        stripeSplitPercentage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByRole = /* GraphQL */ `
  query UserByRole(
    $role: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByRole(
      role: $role
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        lastName
        email
        rating
        country
        gender
        genre
        picture
        role
        status
        stripeAccount
        stripeAccountStatus
        stripeSplitPercentage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByStripeAccount = /* GraphQL */ `
  query UserByStripeAccount(
    $stripeAccount: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByStripeAccount(
      stripeAccount: $stripeAccount
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        firstName
        lastName
        email
        rating
        country
        gender
        genre
        picture
        role
        status
        stripeAccount
        stripeAccountStatus
        stripeSplitPercentage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductOrder = /* GraphQL */ `
  query GetProductOrder($id: ID!) {
    getProductOrder(id: $id) {
      id
      productID
      orderID
      product {
        id
        title
        description
        coverPhoto
        sampleAudio
        originalFile
        price
        orders {
          nextToken
        }
        owner
        deleted
        createdAt
        updatedAt
      }
      order {
        id
        date
        email
        chargeId
        total
        products {
          nextToken
        }
        owner
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listProductOrders = /* GraphQL */ `
  query ListProductOrders(
    $filter: ModelProductOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productID
        orderID
        product {
          id
          title
          description
          coverPhoto
          sampleAudio
          originalFile
          price
          owner
          deleted
          createdAt
          updatedAt
        }
        order {
          id
          date
          email
          chargeId
          total
          owner
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
