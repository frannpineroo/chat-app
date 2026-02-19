import prisma from '../prisma/client.js';
import Repositorio from './Repositorio.js';

class NotificacionRepositorio extends Repositorio {
    constructor() {
        super(prisma.notificacion); 
    }

    async crearNotificacion(dto) {
        return await this.create({
            //data: {
                usuarioId: dto.usuarioId,
                mensaje: dto.mensaje,
                fechaCreacion: new Date(),
                pendiente: true
            //}
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
            const existe = await this.selectById(notificacionId);
            if (!existe) return false;

            await this.update({
                where: { id: notificacionId },
                data: { pendiente: false }
            });
            return true;

        } catch (error) {
            return false;
        }
    }
}

export default NotificacionRepositorio;
