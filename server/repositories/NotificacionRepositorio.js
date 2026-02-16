const prisma = require('../prisma/client');
const Repositorio = require('./Repositorio');

class NotificacionRepositorio extends Repositorio {
    constructor() {
        super(prisma.Notificacion); 
    }

    async crearNotificacion(dto) {
        return await this.model.create({
            data: {
                usuarioId: dto.usuarioId,
                mensaje: dto.mensaje,
                fechaCreacion: new Date(),
                pendiente: true
            }
        });
    }

    async pendientePorUsuario(usuarioId) {
        return await this.model.findMany({
            where: {
                usuarioId,
                pendiente: true
            },
            orderBy: {
                fechaCreacion: 'desc'
            },
            select: {
                id: true,
                usuarioId: true,
                mensaje: true,
                fechaCreacion: true,
                pendiente: true,
                
            }
        });
    }

    async marcarLeido(notificacionId) {
        try {
            const notificacion = await this.model.findUnique({
                where: { id: notificacionId }
            });

            if (!notificacion) return false;

            await this.model.update({
                where: { id: notificacionId },
                data: { pendiente: false }
            });

            return true;

        } catch (error) {
            return false;
        }
    }
}

module.exports = NotificacionRepositorio;
