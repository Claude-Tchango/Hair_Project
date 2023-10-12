const { gql } = require('apollo-server');
//const produitTypeDefs = require('../Produit/schema');
//const routineTypeDefs = require('../Routines/schema');

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
    routines: [Routines!]!
    role: UserRole!
  }
  type Me {
    user: Users
    token: String
  }
  type Query {
    getUser(id: ID!): Users
    getAllUsers: [Users!]!
  }

  type Mutation {
    createUser(firstName: String!, lastName: String!, email: String!, mdp: String!, age: Int, profileImage: String, typeDeCheveux: String): Users
    updateUser(id: ID!, firstName: String, lastName: String, email: String, mdp: String, age: Int, profileImage: String, typeDeCheveux: String): Users
    deleteUser(id: ID!): Boolean
    login(email: String!, mdp: String!): Me
    deleteMyAccount: Boolean
  }
  
  
`;

module.exports = typeDefs;
