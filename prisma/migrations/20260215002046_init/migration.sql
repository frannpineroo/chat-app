-- CreateTable
CREATE TABLE "usuarios" (
    "id_users" SERIAL NOT NULL,
    "first_name" VARCHAR(45) NOT NULL,
    "last_name" VARCHAR(45) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "contra" VARCHAR(45) NOT NULL,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_users")
);

-- CreateTable
CREATE TABLE "chats" (
    "id_chat" SERIAL NOT NULL,
    "name_chats" VARCHAR(45) NOT NULL,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "is_moderated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id_chat")
);

-- CreateTable
CREATE TABLE "chat_miembros" (
    "id_chat_member" SERIAL NOT NULL,
    "users_id_users" INTEGER NOT NULL,
    "chats_id_chat" INTEGER NOT NULL,
    "can_write" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_moderator" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "chat_miembros_pkey" PRIMARY KEY ("id_chat_member")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id_message" SERIAL NOT NULL,
    "info" VARCHAR(1000) NOT NULL,
    "message_type" VARCHAR(45) NOT NULL DEFAULT 'text',
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "chats_id_chat" INTEGER NOT NULL,
    "users_id_users" INTEGER NOT NULL,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id_message")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_roles" SERIAL NOT NULL,
    "name_roles" VARCHAR(45) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_roles")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "users_id_users" INTEGER NOT NULL,
    "roles_id_roles" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("users_id_users","roles_id_roles")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notification" SERIAL NOT NULL,
    "mensaje" VARCHAR(45) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_pending" BOOLEAN NOT NULL DEFAULT true,
    "users_id_users" INTEGER NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notification")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "chat_miembros" ADD CONSTRAINT "chat_miembros_users_id_users_fkey" FOREIGN KEY ("users_id_users") REFERENCES "usuarios"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_miembros" ADD CONSTRAINT "chat_miembros_chats_id_chat_fkey" FOREIGN KEY ("chats_id_chat") REFERENCES "chats"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_chats_id_chat_fkey" FOREIGN KEY ("chats_id_chat") REFERENCES "chats"("id_chat") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_users_id_users_fkey" FOREIGN KEY ("users_id_users") REFERENCES "usuarios"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_users_id_users_fkey" FOREIGN KEY ("users_id_users") REFERENCES "usuarios"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roles_id_roles_fkey" FOREIGN KEY ("roles_id_roles") REFERENCES "roles"("id_roles") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_users_id_users_fkey" FOREIGN KEY ("users_id_users") REFERENCES "usuarios"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;
