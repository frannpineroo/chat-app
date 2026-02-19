import ChatRepositorio from '../repositories/ChatRepositorio';

const chatRepo = new ChatRepositorio();

export async function buscarUsuario(req, res) {
    
    try {
        const { id } = req.params;
        const chats = await chatRepo.buscarPorUsuario(Number(id));

        if (!chats || chats.length === 0)
            return res.status(404).json({ message: "No se encontraron chats" });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar chats", error });
    }
}

export async function buscarChat(req, res) {
    try {
        const { id } = req.params;
        const chat = await chatRepo.buscarChatPorId(Number(id));

        if (!chat)
            return res.status(404).json({ message: "El chat no existe" });

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar chat", error });
    }
}

export async function buscarTodos(req, res) {
    try {
        const chats = await chatRepo.traerTodos();
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function crearChat(req, res) {
try {
    const { usuariosIds, ...data } = req.body;

    if (!usuariosIds || usuariosIds.length === 0)
        return res.status(400).json({ message: "Debe seleccionar usuarios para crear el chat" });
    if (!data.nombre)
            return res.status(400).json({ message: "El chat debe tener un nombre" });

    const chat = await chatRepo.crearChat(data, usuariosIds);

    res.status(201).json({ message: "Chat creado con éxito", chat });
    } catch (error) {
        res.status(500).json({ message: "Error al crear chat", error });
    }
}

export async function actualizarChat(req, res) {
    try {
        const { id } = req.params;

        const actualizado = await chatRepo.actualizarChat(Number(id), req.body);

        if (!actualizado)
            return res.status(404).json({ message: "el Chat no existe" });

        res.json({ message: "Chat actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar chat", error });
    }
}

export async function borrarChat(req, res) {
    try {
        const { id } = req.params;
        const borrado = await chatRepo.borrarChat(Number(id));

        if (!borrado)
            return res.status(404).json({ message: "El chat no existe" });

        res.json({ message: "Chat eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar chat", error });        
    }
}
