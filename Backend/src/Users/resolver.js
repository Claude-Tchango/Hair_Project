const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('../auth');
const schema = require('./schema');

const userResolvers = {
    Query: {
        getAllUsers: async (_, __, context) => {
            ensureAuthenticated(context);
            return await context.models.Users.findAll();
        },
        getRoutinesByUser: async (_, args, context) => {
            ensureAuthenticated(context);
            const { userId } = args;
            return await context.models.Routines.findAll({ where: { userId } });
        },
        getUser: async (_, { id }, context) => {
            ensureAuthenticated(context);
            return await context.models.Users.findByPk(id);
        },
    },
    Mutation: {
        createUser: async (_, { firstName, lastName, email, mdp }, context) => {
            const existingUser = await context.models.Users.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('An account with this email already exists');
            }
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
        login: async (_, { email, mdp }, { models }) => {
            const user = await models.Users.findOne({ where: { email } });
            if (!user) throw new Error('No user found with this email');

            const valid = await bcrypt.compare(mdp, user.mdp);
            if (!valid) throw new Error('Incorrect password');

            const token = jwt.sign({ id: user.id }, 'votre_secret_jwt', { expiresIn: '1d' });

            return {
                userId: user.id,
                user,
                token,
            };
        },
        deleteMyAccount: async (_, __, { models, user, context }) => {
            ensureAuthenticated(context);
            if (!user) throw new Error('You are not authenticated!');

            const result = await models.Users.destroy({ where: { id: user.id } });
            return result > 0;
        },
    },
};

module.exports = userResolvers;
