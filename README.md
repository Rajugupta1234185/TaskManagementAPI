# Task Management API

A secure RESTful Task Management API built with **NestJS, TypeScript, PostgreSQL, and Prisma**, following a **Modular Clean Architecture** approach.

The application provides JWT authentication, secure password hashing, task CRUD operations, request validation, authorization, centralized exception handling, and rate limiting.

---

##  Quick Start

### Prerequisites

Make sure you have installed:

* Node.js 22.22.2
* npm
* PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/Rajugupta1234185/TaskManagementAPI
cd task-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_ACCESS_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_jwt_refresh_secret

```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

### 7. Test the API

A ready-to-use **`api.http`** file is included at the **root level of the project**.

```text
task-management/
├── api.http
├── prisma/
├── src/
├── .env
├── package.json
└── README.md
```

The `api.http` file contains requests for:

* User registration
* User login
* Creating tasks
* Getting tasks
* Getting a task by ID
* Updating tasks
* Completing tasks
* Deleting tasks
* Validation failures
* Invalid authentication
* Missing authentication
* Duplicate registration
* Non-existent tasks
* Task ownership/authorization testing

You can execute the requests directly from VS Code using an HTTP client such as the **REST Client** extension.

---

# 🏗️ Architecture

The project follows a **Modular Clean Architecture** approach.

The application is divided into business-focused modules, while each module separates its responsibilities into different architectural layers.

```text
src/
└── modules/
    ├── auth/
    ├── user/
    └── task/
```

Each business module follows the Clean Architecture principle of separating:

```text
Domain
Application
Infrastructure
Presentation
```

### Architecture Flow

```text
                    HTTP Request
                         │
                         ▼
                 ┌───────────────┐
                 │  Presentation │
                 │ Controllers   │
                 │ DTOs / Guards │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Application  │
                 │   Use Cases   │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │    Domain     │
                 │ Business Rules│
                 │   Contracts   │
                 └───────▲───────┘
                         │
                         │
                 ┌───────┴───────┐
                 │ Infrastructure│
                 │ Prisma / DB   │
                 └───────────────┘
```

The core business logic is kept independent from infrastructure details such as Prisma and PostgreSQL.

This makes the application easier to maintain, test, and extend.

---

# 📦 Modules

## Auth Module

Responsible for authentication-related functionality:

* User registration
* User login
* Password verification
* JWT token generation
* Authentication

## User Module

Responsible for user-related functionality and persistence.

A user contains:

```text
id
email
password
createdAt
```

Email addresses are unique.

## Task Module

Responsible for task management:

* Create task
* Retrieve tasks
* Retrieve task by ID
* Update task
* Delete task
* Task ownership validation

---

# 🛠️ Tech Stack

| Technology        | Purpose              |
| ----------------- | -------------------- |
| NestJS 11         | Backend framework    |
| TypeScript        | Programming language |
| PostgreSQL        | Relational database  |
| Prisma 7          | ORM                  |
| JWT               | Authentication       |
| bcrypt            | Password hashing     |
| class-validator   | Request validation   |
| class-transformer | DTO transformation   |
| @nestjs/throttler | Rate limiting        |
| Jest              | Testing              |
| Supertest         | HTTP/e2e testing     |

---

# 🔐 Authentication & Authorization

The API uses JWT-based authentication.

Authentication flow:

```text
Register
   │
   ▼
Password hashed with bcrypt
   │
   ▼
User stored in PostgreSQL
   │
   ▼
Login
   │
   ▼
Credentials verified
   │
   ▼
JWT access token generated
   │
   ▼
Client sends Bearer token
   │
   ▼
JWT validated
   │
   ▼
Authenticated user identified
   │
   ▼
Task ownership verified
```

Task endpoints require:

```http
Authorization: Bearer <access_token>
```

Users can only access, modify, and delete their own tasks.

---

# 🗄️ Database Design

The application uses PostgreSQL with Prisma.

## User

```text
User
├── id
├── email
├── password
└── createdAt
```

## Task

```text
Task
├── id
├── title
├── description
├── isCompleted
├── userId
├── createdAt
└── updatedAt
```

### Relationship

```text
User
  │
  │ 1
  │
  │
  │ N
  ▼
Task
```

Each task belongs to one user through `userId`.

The relationship uses a foreign key and cascade deletion, so deleting a user also removes their associated tasks.

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /auth/register
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns a JWT access token.

---

# Tasks

All task endpoints require authentication.

### Create Task

```http
POST /tasks
Authorization: Bearer <access_token>
```

```json
{
  "title": "Learn NestJS",
  "description": "Complete the backend assessment"
}
```

### Get All Tasks

```http
GET /tasks
Authorization: Bearer <access_token>
```

Returns tasks belonging to the authenticated user.

### Get Task

```http
GET /tasks/:id
Authorization: Bearer <access_token>
```

### Update Task

```http
PATCH /tasks/:id
Authorization: Bearer <access_token>
```

Example:

```json
{
  "title": "Learn NestJS and Prisma",
  "description": "Complete the backend assessment",
  "isCompleted": true
}
```

### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <access_token>
```

---

# ✅ Validation & Error Handling

Request payloads are validated before reaching the application logic.

Examples include:

* Invalid email
* Password below the minimum length
* Missing required fields
* Empty task title
* Invalid field types
* Unexpected fields

The application uses centralized exception handling to provide consistent error responses.

### HTTP Status Codes

| Status | Description                               |
| ------ | ----------------------------------------- |
| `400`  | Bad Request / Validation failure          |
| `401`  | Unauthorized / Invalid or missing JWT     |
| `403`  | Forbidden / Accessing another user's task |
| `404`  | Resource not found                        |
| `409`  | Conflict / Email already exists           |
| `500`  | Internal server error                     |

Raw database errors are not exposed directly to API clients.

---

# 🔒 Security

The application implements several security practices:

* Passwords are hashed using bcrypt.
* Plain-text passwords are never stored.
* JWT authentication protects task endpoints.
* Task ownership is verified before modification or deletion.
* Request payloads are validated.
* JWT secrets are loaded through environment variables.
* Database errors are handled centrally.
* Request throttling is implemented.
* Sensitive configuration is kept outside the source code.

---



# 📁 Project Structure

The project is organized around business modules and Clean Architecture layers.

```text
task-management/
│
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   └── task/
│   │
│   └── main.ts
│
├── prisma/
│   └── schema.prisma
│
├── generated/
│   └── prisma/
│
├── api.http
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🔄 Typical API Flow

```text
Client
  │
  ▼
Controller
  │
  ▼
DTO Validation
  │
  ▼
Use Case
  │
  ▼
Domain / Repository Contract
  │
  ▼
Prisma Repository
  │
  ▼
PostgreSQL
```

This separation keeps HTTP concerns, application logic, business rules, and persistence concerns isolated from each other.

---

# 📋 Quick Review Checklist

A reviewer can quickly verify the implementation using the included `api.http` file.

### Authentication

* [x] Register user
* [x] Login user
* [x] Password hashing
* [x] JWT authentication

### Task Management

* [x] Create task
* [x] Get all user tasks
* [x] Get task by ID
* [x] Update task
* [x] Delete task

### Security

* [x] Protected task endpoints
* [x] User ownership validation
* [x] Invalid JWT handling
* [x] Password hashing
* [x] Rate limiting

### Validation & Errors

* [x] Request validation
* [x] Global exception handling
* [x] `400` validation errors
* [x] `401` authentication errors
* [x] `403` authorization errors
* [x] `404` not found
* [x] `409` duplicate email

---

#  Author

**Raju Gupta**
