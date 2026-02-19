import { PrismaClient, $transaction } from '../prisma/client';
import Repositorio from './Repositorio.js';

const prisma = new PrismaClient();

class ChatRepositorio extends Repositorio {
    constructor() {
        super(prisma.chat);
        this.miembroChat = prisma.miembroChat;
        this.mensaje = prisma.mensaje;
    }

    async buscarPorUsuario(usuarioId) {
        return await this.miembroChat.findMany({
            where: { usuarioId },
            include: {
                chat: true
            }
        });
    }

    async buscarChatPorId(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                mensaje: {
                    orderBy: { fechaEnvio: 'desc' },
                    take: 1
                }
            }
        });
    }

    async traerTodos() {
        return await this.model.findMany({
            include: {
                mensaje: {
                    orderBy: { fechaEnvio: 'desc' },
                    take: 1
                }
            }
        });
    }

    async crearChat(data, usuariosId) {
        return await $transaction(async (tx) => {
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
            where: { nombre }
        });
    }

    async buscarPorGrupo(esGrupo) {
        return await this.model.findMany({
            where: { esGrupo }
        });
    }

    async buscarPorModeracion(esModerado) {
        return await this.model.findMany({
            where: { esModerado }
        });
    }

    async buscarPorFechaCreacion(date) {
        return await this.model.findMany({
            where: {
                fechaCreacion: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lte: new Date(date.setHours(23,59,59,999))
                }
            }
        });
    }

    async buscarPorFechaActualizacion(date) {
        return await this.model.findMany({
            where: {
                fechaActualizacion: {
                    gte: new Date(date.setHours(0,0,0,0)),
                    lte: new Date(date.setHours(23,59,59,999))
                }
            }
        });
    }
}

export default ChatRepositorio;
