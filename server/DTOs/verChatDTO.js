class verChatDTO {
    constructor(chat) {
        this.id = chat.id;
        this.nombreChat = chat.nombreChat;
        this.isGroup = chat.isGroup;

        this.mensajes = chat.mensajes?.[0]?.info ?? "";
    }
}

module.exports = verChatDTO;