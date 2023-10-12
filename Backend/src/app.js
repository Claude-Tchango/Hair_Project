require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 15;

const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { models, sequelize } = require('./database');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ],
});

function loadModules(dir) {
  const modules = fs.readdirSync(dir);
  modules.forEach((file) => {
    if (file.endsWith('resolver.js')) {
      const resolver = require(path.join(dir, file));
      resolvers.push(resolver);
    } else if (file.endsWith('schema.js')) {
      const schema = require(path.join(dir, file));
      schemas.push(schema);
    }
  });
}

const schemas = [];
const resolvers = [];

loadModules(path.join(__dirname, 'Users'));
loadModules(path.join(__dirname, 'Routines'));
loadModules(path.join(__dirname, 'Produit'));
loadModules(path.join(__dirname, 'Programmes'));

const mergedSchema = mergeTypeDefs(schemas);
const mergedResolvers = mergeResolvers(resolvers);

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: mergedSchema,
    resolvers: mergedResolvers,
  }),
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    let currentUser = null;
    try {
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        currentUser = await models.Users.findByPk(payload.id);
      }
    } catch (error) {
      logger.error('Erreur lors de la vérification du token', error);
    }
    return {
      models,
      currentUser,
    };
  },
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
});

async function startServer() {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      logger.info('Tables synchronisées avec succès');
    } else {
      // Use migrations in production
    }
    const { url } = await server.listen();
    logger.info(`Server is running on ${url}`);
  } catch (error) {
    logger.error('Erreur lors de la synchronisation des tables', error);
  }
}

startServer();
