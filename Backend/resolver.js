const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('./auth');

const resolvers = {
  Query: {
    getAllUsers: async (_, __, context) => {
      ensureAuthenticated(context);
      return await context.models.Users.findAll();
    },
    
    getUser: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return await context.models.Users.findByPk(id);
    },
    getAllProducts: async (_, __, context) => {
      ensureAuthenticated(context);
      return await context.models.Produit.find({});
    },
    getProducts: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return await context.models.Produit.findById(id);
    },
    getAllProgramm: async (_, __, context) => {
      ensureAuthenticated(context);
      return await context.models.Programm.find({});
    },
    getProgramm: async (_, { id }, context) => {
      ensureAuthenticated(context);
      return await context.models.Programm.findById(id);
    },
    message: () => 'Bienvenue sur Haircare GraphQL API!',
  },
  Mutation: {
    createUser: async (_, { firstName, lastName, email, mdp }, context) => {
      const hashedPassword = await bcrypt.hash(mdp, 10);
      const user = await context.models.Users.create({
        firstName,
        lastName,
        email,
        mdp: hashedPassword,
      });
      return user;
    },
    updateUser: async (_, { id, firstName, lastName, email, mdp, age, typeDeCheveux, profileImage }, context) => {
      if (!context.currentUser) {
        throw new Error('Not authenticated');
      }
      
      const user = await context.models.Users.findByPk(id);
      if (!user) throw new Error('User not found');
    
      if (mdp) {
        const hashedPassword = await bcrypt.hash(mdp, 10);
        user.mdp = hashedPassword;
      }
    
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (profileImage) user.profileImage = profileImage; 
      if (typeDeCheveux) user.typeDeCheveux = typeDeCheveux;
      if (age) user.age = age;
    
      await user.save();
      return user;
    },
    
    deleteUser: async (_, { id }, context) => {
      ensureAuthenticated(context);
      const result = await context.models.Users.destroy({ where: { id } });
      return result > 0;
    },
 
    createProduit: async (_, { name, price, quantite }, context) => {
      ensureAuthenticated(context);
      const produit = await context.models.Produit.create({
        name,
        price,
        quantite
      });
      return produit;
    },

    updateProduit: async (_, { id, name, price, quantite }, { models }) => {
      ensureAuthenticated(context);
      const produit = await models.Produit.findById(id);
      if (!produit) throw new Error('Product not found');

      if (name) produit.name = name;
      if (price) produit.price = price;
      if (quantite) produit.quantite = quantite;

      await produit.save();
      return produit;
    },

    deleteProduit: async (_, { id }, { models }) => {
      ensureAuthenticated(context);
      const result = await models.Produit.remove({ _id: id });
      return result.n > 0;  // 'n' est le nombre de documents supprimés
    },

    createProgramm: async (_, { name, description, challengeDuMoment }, { models }) => {
      ensureAuthenticated(context);
      const programm = await models.Programm.create({
        name,
        description,
        challengeDuMoment
      });
      return programm;
    },

    updateProgramm: async (_, { id, name, description, challengeDuMoment }, { models }) => {
      ensureAuthenticated(context);
      const programm = await models.Programm.findById(id);
      if (!programm) throw new Error('Program not found');

      if (name) programm.name = name;
      if (description) programm.description = description;
      if (challengeDuMoment) programm.challengeDuMoment = challengeDuMoment;

      await programm.save();
      return programm;
    },

    deleteProgramm: async (_, { id }, { models }) => {
      ensureAuthenticated(context);
      const result = await models.Programm.remove({ _id: id });
      return result.n > 0;
    },
    login: async (_, { email, mdp }, { models }) => {
      // 1. Trouver l'utilisateur avec l'email donné
      const user = await models.Users.findOne({ where: { email } });
      if (!user) throw new Error('No user found with this email');

      // 2. Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
      const valid = await bcrypt.compare(mdp, user.mdp);
      if (!valid) throw new Error('Incorrect password');

      // 3. Si les mots de passe correspondent, générer un token JWT avec l'id de l'utilisateur comme payload
      const token = jwt.sign({ id: user.id }, 'votre_secret_jwt', { expiresIn: '1d' });

      // 4. Retourner un objet avec le token et les informations de l'utilisateur
      return {
        user,
        token,
      };
    },

    deleteMyAccount: async (_, __, { models, user }) => {
      ensureAuthenticated(context);
      if (!user) throw new Error('You are not authenticated!');

      const result = await models.Users.destroy({ where: { id: user.id } });
      return result > 0;
    },
  },
};

module.exports = resolvers;
