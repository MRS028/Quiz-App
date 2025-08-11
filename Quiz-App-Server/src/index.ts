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
    credentials: true,
  })
);

// DB connection
let isConnected = false;

async function connectToDB() {
  if (isConnected) return;

  const DB_URI = process.env.DB_URI;
  if (!DB_URI) {
    console.error("❌ MongoDB connection string (DB_URI) not found in .env");
    throw new Error("MongoDB URI missing");
  }

  await mongoose.connect(DB_URI);
  isConnected = true;
  console.log("✅ Connected to MongoDB");
}

// ====== Schema Definitions ======
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

interface QuizSessionDocument extends mongoose.Document {
  quizId: mongoose.Types.ObjectId;
  name: string;
  class: string;
  marks: number;
  total: number;
  percentage: number;
  answers: string[];
  createdAt: Date;
}

const quizSessionSchema = new mongoose.Schema<QuizSessionDocument>(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    name: { type: String, required: true },
    class: { type: String, required: true },
    marks: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: [{ type: String }],
  },
  { timestamps: true }
);

const QuizSession =
  mongoose.models.QuizSession ||
  mongoose.model<QuizSessionDocument>(
    "QuizSession",
    quizSessionSchema,
    "quiz_sessions"
  );

// Middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectToDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Quiz App API is running...");
});

// Quiz CRUD Operations
app.post("/api/quizzes", async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body;
    if (!title || !questions?.length) {
      return res
        .status(400)
        .json({ error: "Title and questions are required" });
    }

    const quiz = new Quiz({ title, description, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error creating quiz" });
  }
});

app.get("/api/quizzes", async (_req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});

app.get("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz" });
  }
});

app.patch("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body;
    if (!title || !questions?.length) {
      return res
        .status(400)
        .json({ error: "Title and questions are required" });
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, updatedAt: new Date() },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error updating quiz" });
  }
});

app.delete("/api/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting quiz" });
  }
});

// Quiz Session Endpoints
app.post("/api/quiz-sessions", async (req: Request, res: Response) => {
  try {
    const { name, class: className, quizId } = req.body;

    if (!name || !className || !quizId) {
      return res
        .status(400)
        .json({ error: "Name, class, and quizId are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const session = new QuizSession({
      quizId,
      name,
      class: className,
      marks: 0,
      total: quiz.questions.length,
      percentage: 0,
      answers: Array(quiz.questions.length).fill(null),
    });

    await session.save();

    res.status(201).json({
      message: "Quiz session started successfully",
      sessionId: session._id,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error("Error starting quiz session:", error);
    res.status(500).json({ error: "Error starting quiz session" });
  }
});

app.post(
  "/api/quiz-sessions/:sessionId/submit",
  async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { marks, total, percentage, answers } = req.body;
      // console.log(req.body)

      if (!marks || !total || !percentage || !answers) {
        return res
          .status(400)
          .json({ error: "All result fields are required" });
      }

      const session = await QuizSession.findByIdAndUpdate(
        sessionId,
        {
          marks,
          total,
          percentage,
          answers,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!session) {
        return res.status(404).json({ error: "Quiz session not found" });
      }

      res.json({
        message: "Quiz results submitted successfully",
        session,
      });
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      res.status(500).json({ error: "Error submitting quiz results" });
    }
  }
);

// Class-wise quiz sessions stats

app.get("/api/quiz-sessions/classwise", async (req: Request, res: Response) => {
  try {
    const results = await QuizSession.aggregate([
      {
        $group: {
          _id: {
            class: "$class",
            quizId: "$quizId",
            name: "$name",
          },
          marks: { $max: "$marks" },
          percentage: { $max: "$percentage" },
          total: { $first: "$total" },
        },
      },
      {
        $group: {
          _id: { class: "$_id.class", quizId: "$_id.quizId" },
          totalStudents: { $sum: 1 },
          averagePercentage: { $avg: "$percentage" },
          highestPercentage: { $max: "$percentage" },
          lowestPercentage: { $min: "$percentage" },
          students: {
            $push: {
              name: "$_id.name",
              marks: "$marks",
              percentage: "$percentage",
              total: "$total",
            },
          },
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id.quizId",
          foreignField: "_id",
          as: "quizInfo",
        },
      },
      { $unwind: "$quizInfo" },

      {
        $addFields: {
          quizTitle: "$quizInfo.title",
        },
      },
      {
        $set: {
          students: {
            $sortArray: { input: "$students", sortBy: { marks: -1 } },
          },
        },
      },
      { $sort: { "_id.class": 1, "_id.quizId": 1 } },
      {
        $project: {
          quizInfo: 0,
        },
      },
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error fetching class-wise quiz stats:", error);
    res.status(500).json({ error: "Error fetching class-wise quiz stats" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
