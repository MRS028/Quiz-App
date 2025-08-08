# QuizMind - Fullstack Quiz Application

This is a fullstack quiz application built with a React frontend (Vite) and a Node.js (Express) backend.

## Live Demo

You can access the live application here: [https://testquizapp28.netlify.app/](https://testquizapp28.netlify.app/)

## Project Structure

The project is divided into two main parts:

- `Quiz-App-Frontend/`: Contains the React frontend application.
- `Quiz-App-Server/`: Contains the Node.js (Express) backend API.

## Frontend (Quiz-App-Frontend)

### Technologies Used

- React (with Vite)
- Redux Toolkit (for state management)
- Tailwind CSS (for styling)
- Shadcn UI (for UI components)

### Setup and Installation

1.  Navigate to the frontend directory:
    ```bash
    cd Quiz-App-Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `Quiz-App-Frontend` directory and add your API base URL:
    ```
    VITE_API_BASE_URL=https://quiz-app-server-snowy.vercel.app/api
    ```
    (Replace with your local backend URL if running locally, e.g., `http://localhost:5000/api`)

4.  Run the development server:
    ```bash
    npm run dev
    ```

The frontend application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Backend (Quiz-App-Server)

### Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)

### Setup and Installation

1.  Navigate to the backend directory:
    ```bash
    cd Quiz-App-Server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Quiz-App-Server` directory and add your MongoDB URI:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
    (e.g., `mongodb://localhost:27017/quizapp` for local or a MongoDB Atlas connection string)

4.  Run the development server:
    ```bash
    npm run dev
    ```

The backend API will be accessible at `http://localhost:5000` (or another port if 5000 is in use).

## Contributing

Feel free to fork this repository and contribute!