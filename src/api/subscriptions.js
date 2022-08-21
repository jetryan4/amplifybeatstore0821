/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProductOrder = /* GraphQL */ `
  subscription OnCreateProductOrder($owner: String) {
    onCreateProductOrder(owner: $owner) {
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
export const onUpdateProductOrder = /* GraphQL */ `
  subscription OnUpdateProductOrder($owner: String) {
    onUpdateProductOrder(owner: $owner) {
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
export const onDeleteProductOrder = /* GraphQL */ `
  subscription OnDeleteProductOrder($owner: String) {
    onDeleteProductOrder(owner: $owner) {
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
