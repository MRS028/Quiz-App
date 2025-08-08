import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://testquizapp28.netlify.app"],
  })
);

// Lazy DB connection handler for serverless environment
let isConnected = false;

async function connectToDB() {
  if (isConnected) {
    // Use existing connection
    return;
  }
  const DB_URI = process.env.DB_URI;
  if (!DB_URI) {
    console.error("❌ MongoDB connection string (DB_URI) not found in .env");
    throw new Error("MongoDB URI missing");
  }
  await mongoose.connect(DB_URI);
  isConnected = true;
  console.log("✅ Connected to MongoDB");
}

// Define schema & model here (same as before)
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

const Quiz =
  mongoose.models.Quiz ||
  mongoose.model<QuizDocument>("Quiz", quizSchema, "quizzes");

// Middleware to connect DB before handling routes
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectToDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

// Routes (same as before)
app.get("/", (_req: Request, res: Response) => {
  res.send("Quiz App API is running...");
});

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

app.get("/api/quizzes", async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes: " + error });
  }
});

app.get("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz: " + error });
  }
});

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
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
