const { gql } = require('apollo-server');

const programmeTypeDefs = gql`
  type Programm {
    id: ID!
    name: String!
    description: String!
    challengeDuMoment: String!
    routines: [Routines!]!
  }

  type Query {
    getProgramm(id: ID!): Programm
    getAllProgramm: [Programm!]!
  }

   type Mutation {
    createProgramm(name: String!, description: String!, challengeDuMoment: String!): Programm
    updateProgramm(id: ID!, name: String, description: String, challengeDuMoment: String): Programm
    deleteProgramm(id: ID!): Boolean
  }
`;

module.exports = programmeTypeDefs;
