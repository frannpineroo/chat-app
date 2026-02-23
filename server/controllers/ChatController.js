const express = require ("express");
const ChatRepositorio = require('../repositories/ChatRepositorio');
const crearChatDTO = require('../DTOs/crearChatDTO');
const verChatDTO = require('../DTOs/verChatDTO');

const router = express.Router();
const chatRepo = new ChatRepositorio();

router.get("/usuarios/:usuarioId/chats", async (req, res) => {
    
    try {
        const id = Number(req.params.usuarioId);
        const chats = await chatRepo.buscarPorUsuario(Number(id));

        if (!chats || chats.length === 0)
            return res.status(404).json({ message: "No se encontraron chats" });

        const dto = chats.map(chat => new verChatDTO(chat));
        return res.json(dto);

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: "Error al buscar chats" });
    }
});

router.get("/usuarios/:usuarioId/filtro/:filtro", async (req, res) => {
    try {
        const id = Number(req.params.usuarioId);
        const filtro = req.params.filtro;

        const chats = await chatRepo.buscarPorFiltro(id, filtro);

        if (!chats || chats.length === 0) {
            return res.status(404).json({
                message: "No se encontraron chats, verifique de nuevo."
            });
        }

        const dto = chats.map(chat => new verChatDTO(chat));
        return res.json(dto);

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });

    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const chat = await chatRepo.buscarChatPorId(id);

        if (!chat)
            return res.status(404).json({ message: "El chat no existe" });

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar chat"});
    }
});

router.get("/", async (req, res) => {
    try {
        const chats = await chatRepo.traerTodos();
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener chats" });
    }
});

router.post("/", async (req, res) => {
try {
    const dto = new crearChatDTO(req.body);

    if (!dto.usuariosIds || dto.usuariosIds.length === 0)
        return res.status(400).json({ message: "Debe seleccionar usuarios para crear el chat" });
    if (!dto.nombreChat)
            return res.status(400).json({ message: "El chat debe tener un nombre" });

    const chat = await chatRepo.crearChat({
        nombreChat: dto.nombreChat,
        isGroup: dto.isGroup,
        isModerated: dto.isModerated
    }, dto.usuariosIds);

    res.status(201).json({ message: "Chat creado con éxito", chat: new verChatDTO(chat) });
    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: "Error al crear chat" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const actualizado = await chatRepo.actualizarChat(id, req.body);

        if (!actualizado)
            return res.status(404).json({ message: "el Chat no existe" });

        res.json({ message: "Chat actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar chat" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const borrado = await chatRepo.borrarChat(id);

        if (!borrado)
            return res.status(404).json({ message: "El chat no existe" });

        res.json({ message: "Chat eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar chat" });        
    }
});

module.exports = router;