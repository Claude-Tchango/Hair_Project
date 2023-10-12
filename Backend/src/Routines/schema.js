const { gql } = require('apollo-server');
//const typeDefs = require('../Users/schema');
//const produitTypeDefs = require('../Produit/schema');

const routineTypeDefs = gql`
  type Routines {
    id: ID!
    name: String!
    produits: [Produit!]!
    instructions: String!
    date: String!
    user: Users!
  }

   type Query {
    getRoutine(id: ID!): Routines
    getAllRoutines: [Routines!]!
    getRoutinesByUser(userId: ID!): [Routines!]!
    getProduitsByRoutine(routineId: ID!): [Produit!]!
  }

   type Mutation {
    createRoutine(name: String!, produits: String!, instructions: String!, date: String!): Routines
    updateRoutine(id: ID!, name: String, produits: String, instructions: String, date: String): Routines
    deleteRoutine(id: ID!): Boolean
  }
  
`;

module.exports = routineTypeDefs;
