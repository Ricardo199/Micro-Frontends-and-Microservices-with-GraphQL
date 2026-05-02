# Micro-Frontends & Microservices with GraphQL

A full-stack community platform built on a micro-frontend and microservices architecture. Each service is independently deployable and communicates through GraphQL APIs, demonstrating modern distributed system design.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Services](#running-the-services)
- [GraphQL API Reference](#graphql-api-reference)
  - [Auth Service](#auth-service-api)
  - [Community Service](#community-service-api)
- [License](#license)

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          Micro-Frontend (auth-mfe)       │
│    React + Vite + Module Federation      │
│              Port: 5173                  │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌───────▼──────────┐
│ Auth Service  │  │ Community Service │
│  Apollo/GQL   │  │   Apollo/GQL      │
│   Port 4001   │  │    Port 4002      │
└───────┬───────┘  └───────┬──────────┘
        │                  │
┌───────▼──────┐  ┌────────▼─────────┐
│  MongoDB      │  │   MongoDB         │
│  auth-service │  │ community-service │
└──────────────┘  └──────────────────┘
```

Each backend service owns its own database, its own GraphQL schema, and runs as an independent process. The React micro-frontend consumes both services directly via Apollo Client.

---

## Features

- **Authentication** — JWT-based signup, login, logout, and token refresh with role-based user accounts
- **Community Posts** — Create, read, update, and delete posts with category filtering and AI-generated summaries
- **Help Requests** — Post help requests with optional location, volunteer sign-up, and resolution tracking
- **Discussion Board** — Community discussion page accessible after authentication
- **User Profiles & Account Settings** — Per-user profile view and account management
- **Micro-Frontend Ready** — Vite Module Federation configuration for federated component sharing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM v6, Apollo Client 4 |
| Module Federation | `@originjs/vite-plugin-federation` |
| Backend | Node.js, Express |
| API Layer | Apollo Server 4, GraphQL |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Dev Tooling | nodemon, ESLint |

---

## Project Structure

```
.
├── backend/
│   ├── auth-service/           # Authentication microservice (port 4001)
│   │   ├── graphQL/
│   │   │   ├── typeDefs.js     # User, AuthPayload schema
│   │   │   └── resolvers.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── utils/
│   │   └── src/server.js
│   └── community-service/      # Community microservice (port 4002)
│       └── src/
│           ├── graphql/
│           │   ├── typeDefs.js # Post, HelpRequest schema
│           │   └── resolvers.js
│           ├── models/
│           │   ├── Post.js
│           │   └── HelpRequest.js
│           └── server.js
└── frontend/
    └── auth-mfe/               # React micro-frontend (port 5173)
        └── src/
            ├── pages/
            │   ├── auth/       # Login & Signup
            │   └── resdient/   # Home, News, Discussion, Help, Profile, Settings
            ├── graphQL/        # Apollo queries & mutations
            └── services/
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (or a MongoDB Atlas connection string)
- **npm** v9+

### Environment Variables

Create a `.env` file in each backend service directory.

**`backend/auth-service/.env`**
```env
PORT=4001
MONGO_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=your-secret-key
```

**`backend/community-service/.env`**
```env
PORT=4002
MONGO_URI=mongodb://localhost:27017/community-service
JWT_SECRET=your-secret-key
```

> ⚠️ Use the **same `JWT_SECRET`** across both services so that tokens issued by the auth service are accepted by the community service.

### Running the Services

Each service is started independently. Open a terminal for each.

**Auth Service**
```bash
cd backend/auth-service
npm install
npm run dev      # or: npm start
```

**Community Service**
```bash
cd backend/community-service
npm install
npm run dev      # or: npm start
```

**Frontend (auth-mfe)**
```bash
cd frontend/auth-mfe
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## GraphQL API Reference

Both services expose a GraphQL endpoint at `/graphql` and can be explored with Apollo Sandbox or any GraphQL client.

### Auth Service API

**Endpoint:** `http://localhost:4001/graphql`

#### Queries

| Query | Description |
|---|---|
| `me` | Returns the currently authenticated user |
| `getUser(_id: ID!)` | Fetch a single user by ID |
| `getAllUsers` | Fetch all registered users |

#### Mutations

| Mutation | Description |
|---|---|
| `signup(username, email, password, role)` | Register a new user, returns tokens |
| `login(email, password)` | Authenticate a user, returns tokens |
| `logout` | Invalidate the current session |
| `refreshToken(refreshToken)` | Obtain a new access token |
| `updateUser(_id, ...)` | Update user fields |
| `deleteUser(_id)` | Delete a user account |

### Community Service API

**Endpoint:** `http://localhost:4002/graphql`

#### Queries

| Query | Description |
|---|---|
| `posts(category)` | List all posts, optionally filtered by category |
| `post(_id)` | Fetch a single post |
| `helpRequests(isResolved)` | List all help requests, optionally filtered by status |
| `helpRequest(_id)` | Fetch a single help request |

#### Mutations

| Mutation | Description |
|---|---|
| `createPost(title, content, category)` | Create a new community post |
| `updatePost(_id, ...)` | Update an existing post |
| `deletePost(_id)` | Delete a post |
| `createHelpRequest(description, location)` | Post a new help request |
| `volunteerForHelpRequest(_id)` | Sign up to help with a request |
| `resolveHelpRequest(_id)` | Mark a help request as resolved |
| `updateHelpRequest(_id, ...)` | Update a help request |

> **Authentication:** Mutations that require a logged-in user expect an `Authorization: Bearer <accessToken>` header.

---

## License

This project is licensed under the [ISC License](LICENSE).
