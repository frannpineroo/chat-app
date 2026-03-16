# App Chat (WebSockets)

## 🧩 Descripción
Esta es una aplicación de chat en tiempo real con **WebSockets (socket.io)**, **autenticación JWT**, y **persistencia en PostgreSQL** usando **Prisma**. Permite a los usuarios registrarse, iniciar sesión, unirse a chats (globales y privados) y enviar mensajes en tiempo real.

## 🛠️ Stack tecnológico
- **Node.js + Express** (API REST + servidor)
- **Socket.IO** (comunicación en tiempo real)
- **PostgreSQL** (base de datos)
- **Prisma** (ORM)
- **JWT + Cookies** (autenticación)
- **HTML/CSS/JS estático** (frontend)

## 🧱 Arquitectura del proyecto

- `server/`
  - `server.js` – punto de entrada (configura Express, rutas y sockets)
  - `routes/` – definición de rutas API
  - `controllers/` – lógica de cada ruta
  - `services/` + `repositories/` – lógica de negocio y acceso a datos (Prisma)
  - `middlewares/` – autenticación y redirecciones
  - `sockets/` – lógica de WebSockets (socket.io)
- `public/` – archivos estáticos (HTML, JS, CSS)
- `views/` – páginas protegidas servidas por Express
- `prisma/` – esquema y migraciones para PostgreSQL

## 🔌 Ejemplo de endpoints

### Autenticación
- **POST** `/auth/register` – registro de usuario
- **POST** `/auth/login` – inicio de sesión (devuelve JWT)

### Chats
- **GET** `/api/chats` – obtener chats
- **POST** `/api/chats` – crear un chat

### Mensajes
- **GET** `/api/mensajes` – obtener mensajes
- **POST** `/api/mensajes` – enviar un mensaje

> 🔒 Las rutas que son protegidas requieren que el cliente envíe el token JWT en una cookie.

## 🚀 Cómo correr el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (ejemplo en `.env`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="tu_secreto"
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

4. Abrir el navegador en:

- `http://localhost:3000/` → registro
- `http://localhost:3000/login` → login

---

¡Listo! Ya tenés la app corriendo con WebSockets y Prisma conectando a PostgreSQL.