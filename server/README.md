# Task Management Server

Node.js server to feed the task management client. It provides the API for managing user authentication and task list.

## Technology Stack

-   Node.js
-   Express
-   TypeScript
-   MongoDB
-   JWT Authentication

## Installation

1. Clone the repository:

    ```
    git clone <repository-url>
    cd server
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Create a `.env` file:

    ```
    touch .env
    ```

    Add the following variables:

    ```
    MONGODB_URI=mongodb://localhost:27017/your_db
    JWT_SECRET=your_secret_key
    PORT=5000
    ENCRYPTION_SECRET_KEY=your_key

    ```

4. Start the server:

    ```
    npm run dev
    ```

5. Server will run on `http://localhost:5000`.

## API Endpoints

### Authentication

-   **POST** `api/auth/register`: Register a new user.
-   **POST** `api/auth/login`: Login with username and password.
-   **GET** `api/auth/users/current`: Get current logged user.
-   **PATCH** `api/auth/users/current`: Change current user details.

### Chat

-   **GET** `api/tasks`: Retrieve task list.
-   **GET** `api/tasks/:id`: Retrieve task with given id.
-   **POST** `api/tasks`: Creates a new task.
-   **PATCH** `api/tasks/:id`: Updates task with given id.
-   **DELETE** `api/tasks/:id`: Deletes task with given id.

## Features

-   User Authentication
-   JWT Token Generation
-   Task CRUD Operations
-   Data Encryption
