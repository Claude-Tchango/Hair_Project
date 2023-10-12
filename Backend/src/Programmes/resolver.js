const { ensureAuthenticated } = require('../auth');

const programmeResolvers = {
    Programm: {
        routines: async (parent, _, context) => {
            return await context.models.Routines.findAll({ where: { programmId: parent.id } });
        }
    },
    Query: {
        getProgramm: async (_, { id }, context) => {
            ensureAuthenticated(context);
            return await context.models.Programm.findByPk(id);
        },
        getAllProgramm: async (_, __, context) => {
            ensureAuthenticated(context);
            return await context.models.Programm.findAll();
        },
    },
    Mutation: {
        createProgramm: async (_, { name, description, challengeDuMoment, routineIds }, context) => {
            ensureAuthenticated(context);
            const programm = await context.models.Programm.create({
                name,
                description,
                challengeDuMoment,
            });

            if (routineIds && routineIds.length) {
                const routines = await context.models.Routines.findAll({
                    where: { id: routineIds }
                });
                if (routines && routines.length) {
                    await programm.addRoutines(routines);
                }
            }

            return programm;
        },
        updateProgramm: async (_, { id, name, description, challengeDuMoment, routineIds }, context) => {
            ensureAuthenticated(context);
            const programm = await context.models.Programm.findByPk(id);
            if (!programm) throw new Error('Program not found');

            if (name) programm.name = name;
            if (description) programm.description = description;
            if (challengeDuMoment) programm.challengeDuMoment = challengeDuMoment;

            if (routineIds) {
                const routines = await context.models.Routines.findAll({
                    where: { id: routineIds }
                });
                if (routines && routines.length) {
                    await programm.setRoutines(routines);
                }
            }

            await programm.save();
            return programm;
        },
        deleteProgramm: async (_, { id }, context) => {
            ensureAuthenticated(context);
            const programm = await context.models.Programm.findByPk(id);
            if (programm) {
                await programm.setRoutines([]);
                await programm.destroy();
                return true;
            }
            return false;
        },
    },
};

module.exports = programmeResolvers;
