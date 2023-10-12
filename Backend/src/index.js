const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const jwt = require('jsonwebtoken');
const { models, sequelize } = require('./database');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let currentUser = null;

        try {
            if (token) {
                const payload = jwt.verify(token, 'votre_secret_jwt');
                currentUser = await models.Users.findByPk(payload.id);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification du token', error);
        }

        return {
            models,
            currentUser,
        };
    },
});

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.PORT || 4000;

app.listen(port, async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Tables synchronisées avec succès');
        console.log(`Server is running on http://localhost:${port}/graphql`);
    } catch (error) {
        console.error('Erreur lors de la synchronisation des tables', error);
    }
});
