const { ensureAuthenticated } = require('../auth');

const produitResolvers = {
    Query: {
        getAllProducts: async (_, __, context) => {
            ensureAuthenticated(context);
            return await context.models.Produit.find({});
        },
        getProducts: async (_, { id }, context) => {
            ensureAuthenticated(context);
            return await context.models.Produit.findById(id);
        },
    },
    Mutation: {
        createProduit: async (_, { name, price, quantite, image }, context) => {
            ensureAuthenticated(context);
            const produit = await context.models.Produit.create({
                name,
                price,
                quantite,
                image,
            });
            return produit;
        },
        updateProduit: async (_, { id, name, price, quantite, image }, context) => {
            ensureAuthenticated(context);
            const produit = await context.models.Produit.findByPk(id);
            if (!produit) throw new Error('Product not found');

            if (name) produit.name = name;
            if (price) produit.price = price;
            if (quantite) produit.quantite = quantite;
            if (image) produit.image = image;

            await produit.save();
            return produit;
        },
        deleteProduit: async (_, { id }, context) => {
            ensureAuthenticated(context);
            const result = await context.models.Produit.destroy({ where: { id } });
            return result > 0;
        },
    },
};

module.exports = produitResolvers;
