import { Router } from "express";
import MensajeRepositorio from "../repositories/MensajeRepositorio.js";
import ChatRepositorio from "../repositories/ChatRepositorio.js";
import { TipoMensaje } from "../Enums/TipoMensaje.js";
import { io } from "../server/sockets.js";

const router = Router();
const mensajeRepo = new MensajeRepositorio();
const chatRepo = new ChatRepositorio();

// Helper para obtener el id del usuario autenticado
function getCurrentUserId(req) {
    if (req.user && req.user.id) {
        return parseInt(req.user.id);
    }
    return 0;
}


router.get("/:id", async (req, res) => {
    try {
        const usuarioId = getCurrentUserId(req);
        const id = parseInt(req.params.id);

        const m = await mensajeRepo.buscarPorId(id);
        if (!m) return res.status(404).json({ message: `No existe el mensaje` });

        if (m.archivado && usuarioId !== 1)
            return res.status(404).json({ message: `No existe el mensaje` });

        const dto = {
            id: m.id,
            chatId: m.chatId,
            emisorId: m.emisorId,
            nombre: m.emisorId
                ? `${m.emisorId.firstName} ${m.emisorId.lastName}` : "",
            contenido: m.contenido,
            tipoMensaje: m.tipoMensaje,
            archivo: m.archivo
                ? Buffer.from(m.archivo).toString("base64") : null,
            fechaEnvio: m.fechaEnvio,
            leido: m.leido
        };
        res.json(dto);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const dto = req.body;

        if (!dto)
            return res.status(400).json({ message: "El mensaje está vacío" });

        if (!dto.contenido || dto.contenido.trim() === "")
            return res.status(400).json({ message: "El mensaje no puede estar vacío" });

        const chatExiste = await chatRepo.selectById(dto.chatId);
        if (!chatExiste)
            return res.status(400).json({ message: `No existe chat con id ${dto.chatId}` });

        const nuevo = {
            chatId: dto.chatId,
            emisorId: dto.emisorId,
            contenido: dto.contenido,
            archivo: dto.archivo,
            tipoMensaje: TipoMensaje.text,
            fechaEnvio: dto.fechaEnvio || new Date(),
            archivado: false,
            leido: false
        };

        const guardar = await mensajeRepo.crearMensaje(nuevo);

        const verDto = {
            id: guardar.id,
            chatId: guardar.chatId,
            emisorId: guardar.emisorId,
            nombre: guardar.emisorId
                ? `${guardar.emisorId.firstName} ${guardar.emisorId.lastName}` : "",
            contenido: guardar.contenido,
            tipoMensaje: guardar.tipoMensaje,
            archivo: guardar.archivo
                ? Buffer.from(guardar.archivo).toString("base64") : null,
            fechaEnvio: guardar.fechaEnvio,
            leido: guardar.leido
        };

        // Emitir a la sala del chat
        io.to(`chat-${dto.chatId}`).emit("ReceiveMessage", verDto);

        res.status(201).json({ id: guardar.id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/ocultar/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const mensaje = await mensajeRepo.selectById(id);
        if (!mensaje)
            return res.status(404).json({ message: "No se encuentra el mensaje o ya oculto" });

        mensaje.archivado = true;
        await mensajeRepo.update(id, mensaje);

        res.json({ message: "Mensaje ocultado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/chat/:chatId", async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const currentUserId = getCurrentUserId(req);

        const mensajes = await mensajeRepo.buscarChatPorId(chatId);

        const filtro = mensajes
            .filter(m => !m.archivado || currentUserId === 1) //m.emisorId) en vez de 1
            //.sort((a, b) => new Date(a.fechaEnvio) - new Date(b.fechaEnvio))
            .map(m => ({
                id: m.id,
                chatId: m.chatId,
                emisorId: m.emisorIdId,
                nombre: m.nombreId
                    ? `${m.emisorId.firstName} ${m.emisorId.lastName}` : "",
                contenido: m.contenido,
                tipoMensaje: m.tipoMensaje,
                archivo: m.archivo
                    ? Buffer.from(m.archivo).toString("base64") : null,
                fechaEnvio: m.fechaEnvio,
                leido: m.leido
            }));

        res.json(filtro);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
