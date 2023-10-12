const { ensureAuthenticated } = require('../auth');

const routineResolvers = {
    Query: {
        getRoutine: async (_, { id }, context) => {
            ensureAuthenticated(context);
            const routine = await context.models.Routines.findByPk(id);
            routine.produits = JSON.parse(routine.produits);
            return routine;
        },
        getAllRoutines: async (_, __, context) => {
            ensureAuthenticated(context);
            const routines = await context.models.Routines.findAll();
            routines.forEach(routine => {
                routine.produits = JSON.parse(routine.produits);
            });
            return routines;
        },
        getRoutinesByUser: async (parent, args, context, info) => {
            ensureAuthenticated(context);
            const { userId } = args;
            const routines = await context.models.Routines.findAll({ where: { userId } });
            routines.forEach(routine => {
                routine.produits = JSON.parse(routine.produits);
            });
            return routines;
        },
        getProduitsByRoutine: async (_, { routineId }, context) => {
            ensureAuthenticated(context);
            const routine = await context.models.Routines.findByPk(routineId);
            if (!routine) throw new Error('Routine not found');
            return JSON.parse(routine.produits);
        },
    },
    Mutation: {
        createRoutine: async (_, { name, produits, instructions, date }, context) => {
            ensureAuthenticated(context);
            const routine = await context.models.Routines.create({
                name,
                produits: JSON.stringify(produits),
                instructions,
                date,
                userId: context.currentUser.id,
            });
            routine.produits = JSON.parse(routine.produits);
            return routine;
        },
        updateRoutine: async (_, { id, name, produits, instructions, date }, context) => {
            ensureAuthenticated(context);
            const routine = await context.models.Routines.findByPk(id);
            if (!routine) throw new Error('Routine not found');

            if (name) routine.name = name;
            if (produits) routine.produits = JSON.stringify(produits);
            if (instructions) routine.instructions = instructions;
            if (date) routine.date = date;

            await routine.save();
            routine.produits = JSON.parse(routine.produits);
            return routine;
        },
        deleteRoutine: async (_, { id }, context) => {
            ensureAuthenticated(context);
            const result = await context.models.Routines.destroy({ where: { id } });
            return result > 0;
        },
    },
};

module.exports = routineResolvers;
