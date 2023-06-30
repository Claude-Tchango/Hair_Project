const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema.js');
const mongoose = require('mongoose');
const Sequelize = require('sequelize');
const resolvers = require('./resolver.js');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost/haircare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sequelize = new Sequelize('haircare', 'claude', 'claude', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

const Produit = mongoose.model('Produit', new mongoose.Schema({
  name: String,
  price: Number,
  quantite: Number,
}));

const Programm = mongoose.model('Programm', new mongoose.Schema({
  name: String,
  description: String,
  challengeDuMoment: String,
}));

const Users = sequelize.define('Users', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mdp: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  typeDeCheveux: {
    type: Sequelize.STRING,

  },
  profileImage: {
    type: Sequelize.STRING,

  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM('user', 'admin', 'moderator'),
    allowNull: false,
    defaultValue: 'user',
  },
});

const models = { Users, Produit, Programm };

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

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Tables synchronisées avec succès');
    server.listen().then(({ url }) => {
      console.log(`Server is running on ${url}`);
    });
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation des tables', error);
  });
