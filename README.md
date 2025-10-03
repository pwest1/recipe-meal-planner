# recipe-meal-planner
# RecipeRouter 🍳

RecipeRouter is a full-stack web application designed to help users organize their culinary life. From creating detailed recipes to managing a personal ingredient inventory, this app provides a clean, modern, and secure interface for all your cooking needs.

<img width="1220" height="791" alt="image" src="https://github.com/user-attachments/assets/da6d6636-8309-4f4b-9988-38d506e95aa5" />




---

## ## Key Features

* **Secure User Authentication:** Full login, logout, and signup functionality handled by Auth0.
* **Full Recipe CRUD:** Users can create, read, update, and delete their own private recipes.
* **Ingredient Management:** A personal inventory for ingredients, also with full CRUD functionality.
* **Protected API:** A secure backend API built with Express.js ensures that users can only ever access their own data.
* **Dynamic Frontend:** A responsive and interactive user interface built with React and styled with Tailwind CSS.

---

## ## Tech Stack

This project is built with a modern, type-safe stack.

| Category   | Technology                                     |
| :--------- | :--------------------------------------------- |
| **Frontend** | React.js, TypeScript, Vite, Tailwind CSS       |
| **Backend** | Node.js, Express.js, TypeScript              |
| **Database** | PostgreSQL, Prisma ORM                         |
| **Auth** | Auth0, JWTs                                    |

---

## ## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* A running PostgreSQL database instance

### Backend Setup

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `backend` root and add the required environment variables (see template below).
4.  Sync your database schema with Prisma:
    ```sh
    npx prisma db push
    ```
5.  Start the backend server:
    ```sh
    npm run dev
    ```
    Your backend will be running at `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` root and add the required environment variables (see template below).
4.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    Your frontend will be running at `http://127.0.0.1:5173`.

---

## ## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

**Backend (`backend/.env`):**
```
# The connection string for your PostgreSQL database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Auth0 API Settings
AUTH0_AUDIENCE="YOUR_AUTH0_API_IDENTIFIER"
AUTH0_ISSUER_BASE_URL="https://YOUR_AUTH0_DOMAIN/"
```

**Frontend (`frontend/.env.local`):**
```
# The URL of your backend server
VITE_API_URL="http://localhost:5000"

# Auth0 Application Settings
VITE_AUTH0_DOMAIN="YOUR_AUTH0_DOMAIN"
VITE_AUTH0_CLIENT_ID="YOUR_AUTH0_CLIENT_ID"
VITE_AUTH0_AUDIENCE="YOUR_AUTH0_API_IDENTIFIER"
```

---
