class verChatDTO {
    constructor(chat) {
        this.id = chat.id;
        this.nombreChat = chat.nombreChat;
        this.isPrivate = chat.isPrivate;

        this.mensajes = chat.mensajes?.[0]?.info ?? "";
    }
}

module.exports = verChatDTO;