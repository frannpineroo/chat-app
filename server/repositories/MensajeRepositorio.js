const {PrismaClient} = require ('@prisma/client');
const Repositorio = require ('./Repositorio');

const prisma = new PrismaClient();

class MensajeRepositorio extends Repositorio {
    constructor() {
        super(prisma.mensaje); 
    }

    async crearMensaje(mensaje) {
        
        const crear = await this.model.create({
            data: mensaje
        });

        return await this.model.findUnique({
            where: { id: crear.id },
            include: {
                chat: true,
                emisor: {
                    include: {
                        rol: true
                    }
                }
            }
        });
    }

    async buscarPorId(id) {
        return await this.model.findUnique({
            where: { id },
            include: {
                chat: true,
                emisor: {
                    include: {
                        rol: true
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
                chat: true,
                emisor: true
            }
        });
    }

    async borrarMensaje(id) {
        try {
            const mensaje = await this.model.findUnique({
                where: { id }
            });

            if (!mensaje) return false;

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