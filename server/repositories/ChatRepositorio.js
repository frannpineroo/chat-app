const prisma = require('../prisma/client');
const Repositorio = require('./Repositorio');

class ChatRepositorio extends Repositorio {
    constructor() {
        this.chat = prisma.Chat;
        this.miembroChat = prisma.MiembroChat;
        this.mensaje = prisma.Mensaje;
    }

    async buscarPorUsuario(usuarioId) {
        return await this.miembroChat.findMany({
            where: { usuarioId },
            include: {
                Chat: true
            }
        });
    }

    async buscarChatPorId(id) {
        return await this.chat.findUnique({
            where: { id },
            include: {
                Mensaje: {
                    orderBy: { fechaEnvio: 'desc' },
                    take: 1
                }
            }
        });
    }

    async traerTodos() {
        return await this.chat.findMany({
            include: {
                Mensaje: {
                    orderBy: { fechaEnvio: 'desc' },
                    take: 1
                }
            }
        });
    }

    async crearChat(data, usuariosId) {
        return await prisma.$transaction(async (tx) => {
            const chat = await tx.chat.create({
                data: {
                    nombre: data.nombre,
                    esGrupo: data.esGrupo,
                    esModerado: data.esModerado ?? false,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date()
                }
            });

            const miembros = usuariosId.map(usuarioId => ({
                chatId: chat.id,
                usuarioId
            }));

            await tx.miembroChat.createMany({
                data: miembroChat
            });

            return chat;
        });
    }

    async actualizarChat(id, data) {
        try {
            await this.chat.update({
                where: { id },
                data: {
                    ...data,
                    fechaActualizacion: new Date()
                }
            });
            return true;
        
        } catch {
            return false;
        }
    }

    async borrarChat(id) {
        try {
            await this.chat.delete({
                where: { id }
            });
            return true;

        } catch {
            return false;
        }
    }

    async buscarPorNombre(name) {
        return await this.chat.findFirst({
            where: { name }
        });
    }

    async buscarPorGrupo(esGrupo) {
        return await this.chat.findMany({
            where: { esGrupo }
        });
    }

    async buscarPorModeracion(esModerado) {
        return await this.chat.findMany({
            where: { esModerado }
        });
    }

    async buscarPorFechaCreacion(date) {
        return await this.chat.findMany({
            where: {
                fechaCreacion: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lte: new Date(date.setHours(23,59,59,999))
                }
            }
        });
    }

    async buscarPorFechaActualizacion(date) {
        return await this.chat.findMany({
            where: {
                fechaActualizacion: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lte: new Date(date.setHours(23,59,59,999))
                }
            }
        });
    }
}

module.exports = ChatRepositorio;
