const prisma = require('../prisma/client');

class ChatRepositorio {
    
    async buscarChatPrivado( usuarioA, usuarioB ) {
        return await prisma.chat.findFirst({
            where: {
                isPrivate: true,
                miembros: {
                    some: { usuarioId: usuarioA}
                },
                AND: {
                    miembros: {
                        some: { usuarioId: usuarioB }
                    }
                }
            },
            include: {
                miembros: true
            }
        });
    }

    async crearChatPrivado( usuarioA, usuarioB ) {
        return await prisma.chat.create({
            data: {
                nombreChat: `Chat entre ${usuarioA} y ${usuarioB}`,
                isPrivate: true,
                miembros: {
                    create: [
                        { usuarioId: usuarioA },
                        { usuarioId: usuarioB }
                    ]
                }
            }
        });
    }
}

module.exports = new ChatRepositorio();