const { gql } = require('apollo-server');

const produitTypeDefs = gql`
  type Produit {
    id: ID!
    name: String!
    price: Float!
    quantite: Int!
    image: String!
  }

  type Query {
    getProducts(id: ID!): Produit
    getAllProducts: [Produit!]!
  }

  type Mutation {
    createProduit(name: String!, price: Float!, quantite: Int!, image: String!): Produit
    updateProduit(id: ID!, name: String, price: Float, quantite: Int, image: String): Produit
    deleteProduit(id: ID!): Boolean
  }
`;

module.exports = produitTypeDefs;
