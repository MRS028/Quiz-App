import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // built-in body parser
app.use(cors({ origin: ["http://localhost:5173"] }));

// Connect to MongoDB
const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  console.error("❌ MongoDB connection string (DB_URI) not found in .env");
  process.exit(1);
}
mongoose
  .connect(DB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Schema Definitions
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizDocument extends mongoose.Document {
  title: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new mongoose.Schema<QuizDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model<QuizDocument>("Quiz", quizSchema);

// Routes

// Create Quiz
app.post("/api/quizzes", async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Title and questions are required." });
  }

  try {
    const quiz = new Quiz({ title, description, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error creating quiz: " + error });
  }
});

// Get All Quizzes
app.get("/api/quizzes", async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes: " + error });
  }
});

// Get Single Quiz by ID
app.get("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz: " + error });
  }
});

// Update Quiz
app.patch("/api/quizzes/:id", async (req: Request, res: Response) => {
  const { title, description, questions } = req.body;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Title and questions are required." });
  }

  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, updatedAt: new Date() },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error updating quiz: " + error });
  }
});

// Delete Quiz
app.delete("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting quiz: " + error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
