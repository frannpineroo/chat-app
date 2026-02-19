import { Router } from "express";
import MiembroChatRepositorio from "../repositories/MiembroChatRepositorio";
import ChatRepositorio from "../repositories/ChatRepositorio";

const router = Router();
const miembroRepo = new MiembroChatRepositorio();
const chatRepo = new ChatRepositorio();

router.get("/", async (req, res) => {
    try {
        const miembros = await miembroRepo.select();

        if (!miembros || miembros.length === 0) {
            return res.status(404).json({
                message: "No se encontraron miembros, verifique de nuevo."
            });
        }

        res.json(miembros);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET por chatId
router.get("/porId/:chatId", async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const miembros = await miembroRepo.buscarPorChatId(chatId);

        if (!miembros || miembros.length === 0) {
            return res.status(404).json({
                message: "No hay miembros en este chat."
            });
        }

        res.json(miembros);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        //const dto = req.body;
        const { chatId, usuarioId, esModerador=false, poderEscribir=true } = req.body;

        const chatExiste = await chatRepo.selectById(dto.chatId);
        if (!chatExiste) {
            return res.status(400).json({
                message: `El chat con Id ${dto.chatId} no existe.`
            });
        }

        const entidad = {
            chatId: chatId,
            usuarioId: usuarioId,
            esModerador: esModerador,
            poderEscribir: poderEscribir,
            fechaIngreso: new Date()
        };

        const nuevo = await miembroRepo.insert(entidad);

        res.status(201).json(nuevo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const miembro = req.body;

        if (id !== miembro.id) {
            return res.status(400).json({
                message: "El id del miembro no coincide."
            });
        }

        const existe = await miembroRepo.selectById(id);
        if (!existe) {
            return res.status(404).json({
                message: "Miembro no encontrado."
            });
        }

        await miembroRepo.update(id, miembro);
        res.status(200).json({ message: "Miembro actualizado con éxito" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete("/:id", async (req, res) => { //REVISAR
    try {
        const id = parseInt(req.params.id);
        const eliminado = await miembroRepo.delete(id);

        if (!eliminado) {
            return res.status(404).json({
                message: "Miembro no encontrado."
            });
        }

        res.json({ message: "Miembro eliminado correctamente." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//GET para saber en que chats participa el usuario
router.get("/porUsuario/:userId", async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const miembros = await miembroRepo.buscarPorUsuarioId(usuarioId);

        if (!miembros || miembros.length === 0) {
            return res.status(404).json({
                message: "No se encontraron miembros con este usuario."
            });
        }
        res.json(miembros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
