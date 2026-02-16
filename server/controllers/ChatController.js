import ChatRepositorio from '../repositories/ChatRepositorio';
const chatRepo = new ChatRepositorio();

export async function buscarUsuario(req, res) {
    const { id } = req.params;

    const chats = await chatRepo.buscarPorUsuario(Number(id));

    if (!chats || chats.length === 0)
        return res.status(404).json({ message: "No se encontraron chats" });

    res.json(chats);
}

export async function buscarChat(req, res) {
    const { id } = req.params;

    const chat = await chatRepo.buscarChatPorId(Number(id));

    if (!chat)
        return res.status(404).json({ message: "El chat no existe" });

    res.json(chat);
}

export async function buscarTodos(req, res) {
    const chats = await chatRepo.traerTodos();
    res.json(chats);
}

export async function create(req, res) {
    const { userIds, ...data } = req.body;

    if (!usuariosId || usuariosId.length === 0)
        return res.status(400).json({ message: "Debe seleccionar usuarios para crear el chat" });

    const chat = await chatRepo.crearChat(data, usuariosId);

    res.json({ message: "Chat creado con éxito", chat });
}

export async function actualizacion(req, res) {
    const { id } = req.params;

    const updated = await chatRepo.actualizarChat(Number(id), req.body);

    if (!updated)
        return res.status(404).json({ message: "el Chat no existe" });

    res.json({ message: "Chat actualizado con éxito" });
}

export async function borrar(req, res) {
    const { id } = req.params;

    const deleted = await chatRepo.borrarChat(Number(id));

    if (!deleted)
        return res.status(404).json({ message: "El chat no existe" });

    res.json({ message: "Chat eliminado con éxito" });
}
