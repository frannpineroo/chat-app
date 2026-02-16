const prisma = require('../prisma/client');
const Repositorio = require('./Repositorio');

class MensajeRepositorio extends Repositorio {
    constructor() {
        super(prisma.Mensaje); 
    }

    async crearMensaje(mensaje) {
        
        const crear = await this.model.create({
            data: mensaje
        });

        return await this.model.findUnique({
            where: { id: crear.id },
            include: {
                chatId: true,
                emisorId: {
                    include: {
                        rolId: true
                    }
                }
            }
        });
    }

    async buscarPorId(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                chatId: true,
                emisorId: {
                    include: {
                        rolId: true
                    }
                }
            }
        });
    }

    async buscarChatPorId(chatId) {
        return await this.model.findMany({
            where: { chatId },
            orderBy: {
                fechaEnvio: 'asc'
            },
            include: {
                chatId: true,
                emisorId: true
            }
        });
    }

    async actualizar(id, data) {
        return await this.model.update({
            where: { id },
            data
        });
    }

    async borrarMensaje(id) {
        try {
            const mensaje = await this.model.findUnique({
                where: { id }
            });

            if (!message) return false;

            await this.model.delete({
                where: { id }
            });

            return true;

        } catch (error) {
            return false;
        }
    }
}

module.exports = MensajeRepositorio;
