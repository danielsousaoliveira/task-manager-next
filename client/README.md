# Task Manager Client

Next.js client for task management application with authentication.

## Technology Stack

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn UI
-   JWT Authentication

## Installation

1. Clone the repository:

    ```
    git clone <repository-url>
    cd client
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
    NEXT_PUBLIC_API_URL=http://localhost:5000/api #change if necessary
    JWT_SECRET=your_jwt_secret
    TOKEN_NAME=token

    ```

4. Start the server:

    ```
    npm run dev
    ```

5. Server will run on `http://localhost:5000`.

## Features

-   User Authentication
-   Responsive Design
-   Task Management
-   Profile Management
