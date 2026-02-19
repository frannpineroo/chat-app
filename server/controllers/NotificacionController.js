import { Router } from "express";
import NotificacionRepositorio from "../repositories/NotificacionRepositorio.js";
import { io } from "../sockets";

const router = Router();
const notificacionRepo = new NotificacionRepositorio();

router.get("/user/:usuarioId/pending", async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const notificationes = await notificacionRepo.pendientePorUsuario(usuarioId);
        return res.json(notificationes);

    } catch (error) {
        return res.status(500).json({
            message: "Error inesperado al obtener las notificaciones."
        });
    }
});

router.get("/count/:usuarioId", async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const list = await notificacionRepo.pendientePorUsuario(usuarioId);

        return res.json({ count: list.length });

    } catch (error) {
        return res.status(500).json({
            message: "Error inesperado al contar notificaciones."
        });
    }
});

router.put("/:notificacionId/marcarLeido", async (req, res) => {
    try {
        const notificacionId = parseInt(req.params.notificacionId);

        const notificacion = await notificacionRepo.selectById(notificacionId);

        if (!notificacion) {
            return res.status(404).json({
                message: `No existe la notificación con el Id: ${notificacionId}.`
            });
        }

        // Marcar como leída
        await notificacionRepo.marcarLeido(notificacionId);

        // Emitir evento solo al usuario 
        io.to(`user-${notificacion.usuarioId}`).emit("Notification actualizada");

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            message: "Error inesperado al marcar la notificación como leída."
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const dto = req.body;

        if (!dto.mensaje || dto.mensaje.trim() === "") {
            return res.status(400).json({
                message: "El mensaje no puede estar vacío."
            });
        }

        const notificacion = await notificacionRepo.crearNotificacion(dto);

        // Enviar notificación en tiempo real
        io.to(`user-${dto.usuarioId}`).emit("ReceiveNotification", {
            id: notificacion.id,
            mensaje: notificacion.mensaje,
            fechaCreacion: notificacion.fechaCreacion
        });

        return res.status(201).json({
            id: notificacion.id,
            message: "Notificación registrada con éxito."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al enviar la notificación."
        });
    }
});

export default router;
