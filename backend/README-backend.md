# Sunny Cafe — Backend (demo)

This folder contains a simple demo backend to handle signup, login, and contact messages.

Setup

1. Open a terminal and go to `backend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

Server will run on `http://localhost:4000`.

API endpoints

- `POST /api/signup` — body `{ name, email, password }` — creates a user (password hashed with bcryptjs)
- `POST /api/login` — body `{ email, password }` — returns user object on success
- `POST /api/contact` — body `{ name, email, message }` — stores message
- `GET /api/users` — lists users (id, name, email) — for demo/testing only

Security note

This backend is a demo: it stores data in a local JSON file (`db.json`). For production use a real database, secure HTTPS, proper session handling, and avoid storing passwords in plaintext (we hash them here with bcryptjs).
