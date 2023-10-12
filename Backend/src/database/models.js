const mongoose = require('./mongoose');
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Produit = mongoose.model('Produit', new mongoose.Schema({
    name: String,
    price: Number,
    quantite: Number,
    image: String,
}));

const Programm = mongoose.model('Programm', new mongoose.Schema({
    name: String,
    description: String,
    challengeDuMoment: String,
    routine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routines'
    }
}));

const Users = sequelize.define('Users', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mdp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typeDeCheveux: {
        type: DataTypes.STRING,
    },
    profileImage: {
        type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin', 'moderator'),
        allowNull: false,
        defaultValue: 'user',
    },
});

const Routines = sequelize.define('Routines', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    produits: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    instructions: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    programmId: {
        type: DataTypes.INTEGER,
    },
});

Routines.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Routines, { foreignKey: 'userId' });

module.exports = {
    Produit,
    Users,
    Programm,
    Routines,
};