const {PrismaClient} = require ('@prisma/client');
const Repositorio = require('./Repositorio.js');

const prisma = new PrismaClient();

class ChatRepositorio extends Repositorio {
    constructor() {
        super(prisma.chat);
        this.miembros = prisma.chatMiembro;
        this.mensajes = prisma.mensaje;
    }

    async buscarPorUsuario(id) {
        return await this.model.findMany({
        where: {
            miembros: {
                some: {usuarioId: Number(id)}
            }
        },
        include: {
            mensajes: {
                orderBy: { enviadoEn: 'desc' },
                take: 1
            }
        }
        });
    }

    async buscarChatPorId(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                mensajes: {
                    orderBy: { enviadoEn: 'desc' },
                    take: 1
                }
            }
        });
    }

    async buscarPorFiltro(id, filtro) {
        return await this.model.findMany({
            where: {
                miembros: {
                some: {usuarioId: id}
                },
                nombreChat: {
                contains: filtro,
                mode: "insensitive"
                }
            },
            include: {
                mensajes: {
                    orderBy: { enviadoEn: 'desc' },
                    take: 1
                }
            }
        });
    }

    async traerTodos() {
        return await this.model.findMany({
            include: {
                mensajes: {
                    orderBy: { enviadoEn: 'desc' },
                    take: 1
                }
            }
        });
    }

    async crearChat(data, usuariosId) {
        return await prisma.$transaction(async (tx) => {
            const chat = await tx.chat.create({
                data: {
                    nombreChat: data.nombreChat,
                    isGroup: data.isGroup,
                    isModerated: data.isModerated ?? false
                }
            });

            const miembros = usuariosId.map(usuarioId => ({
                chatId: chat.id,
                usuarioId
            }));

            await tx.chatMiembro.createMany({
                data: miembros
            });

            return chat;
        });
    }

    async actualizarChat(id, data) {
        try {
            await this.model.update({
                where: { id },
                data: {
                    ...data
                }
            });
            return true;
        
        } catch {
            return false;
        }
    }

    async borrarChat(id) {
        try {
            await this.model.delete({
                where: { id }
            });
            return true;

        } catch (error) {
            return false;
        }
    }

    async buscarPorNombre(nombre) {
        return await this.model.findFirst({
            where: { nombreChat: nombre }
        });
    }

    async buscarPorGrupo(isGroup) {
        return await this.model.findMany({
            where: { isGroup }
        });
    }

    async buscarPorModeracion(esModerado) {
        return await this.model.findMany({
            where: { isModerated: esModerado }
        });
    }

    async buscarPorFechaCreacion(date) {
        const start = new Date(date);
                start.setHours(0,0,0,0);
        const end = new Date(date);
                end.setHours(23,59,59,999);
        
        return await this.model.findMany({
            where: {
                createdAt: {
                    
                    gte: start,
                    lte: end    
                }
            }
        });
    }

    async buscarPorFechaActualizacion(date) {
        return await this.model.findMany({
            where: {
                updatedAt: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lte: new Date(date.setHours(23,59,59,999))
                }
            }
        });
    }
}

module.exports = ChatRepositorio;
