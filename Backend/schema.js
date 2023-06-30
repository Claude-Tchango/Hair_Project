const { gql } = require('apollo-server');

const typeDefs = gql`
enum UserRole {
  user
  admin
  moderator
}

  type Users {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int
    email: String!
    profileImage: String
    mdp: String!
    typeDeCheveux: String
    produits: [Produit!]!
    role: UserRole!
  }

  type Produit {
    id: ID!
    name: String!
    price: Float!
    quantite: Int!
  }

  type Programm {
    id: ID!
    name: String!
    description: String!
    challengeDuMoment: String!
  }

  type Me {
    user: Users!
    token: String!
  }
    
  type Query {
    getUser(id: ID!): Users
    getAllUsers: [Users!]!
    getProducts(id: ID!): Produit
    getAllProducts: [Produit!]!
    getProgramm(id: ID!): Programm 
    getAllProgramm: [Programm!]!
    message: String!
  }
  

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, mdp: String!): Users
    updateUser(id: ID!, firstName: String, lastName: String, email: String, mdp: String, age: Int, profileImage: String,typeDeCheveux: String): Users
    deleteUser(id: ID!): Boolean
    createProduit(name: String!, price: Float!, quantite: Int!): Produit
    updateProduit(id: ID!, name: String, price: Float, quantite: Int): Produit
    deleteProduit(id: ID!): Boolean
    createProgramm(name: String!, description: String!, challengeDuMoment: String!): Programm
    updateProgramm(id: ID!, name: String, description: String, challengeDuMoment: String): Programm
    deleteProgramm(id: ID!): Boolean
    login(email: String!, mdp: String!): Me
    deleteMyAccount: Boolean
  }
`;

module.exports = typeDefs;
