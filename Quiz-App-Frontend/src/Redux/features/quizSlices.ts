// quizSlices.ts
import { quizData1, quizData2, quizData3 } from "@/Home/quizData";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const allQuizData = [quizData1, quizData2, quizData3];
const quizData = allQuizData[Math.floor(Math.random() * allQuizData.length)];
interface QuizState {
  questions: typeof quizData;
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  quizCompleted: boolean;
  score: number;
  isTimeUp: boolean;
  timeUpQuestions: number[]; // Track which questions have timed out
}

const initialState: QuizState = {
  questions: quizData,
  currentQuestionIndex: 0,
  userAnswers: Array(quizData.length).fill(null),
  quizCompleted: false,
  score: 0,
  isTimeUp: false,
  timeUpQuestions: [],
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: string }>
    ) => {
      const { questionIndex, answer } = action.payload;
      // Only allow answer if question hasn't timed out
      if (!state.timeUpQuestions.includes(questionIndex)) {
        state.userAnswers[questionIndex] = answer;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.isTimeUp = false;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    completeQuiz: (state) => {
      state.quizCompleted = true;
      state.score = state.userAnswers.reduce((acc, answer, index) => {
        return acc + (answer === state.questions[index].correctAnswer ? 1 : 0);
      }, 0);
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.userAnswers = Array(state.questions.length).fill(null);
      state.quizCompleted = false;
      state.score = 0;
      state.isTimeUp = false;
      state.timeUpQuestions = [];
    },
    setQuiz: (state, action) => {
      state.questions = action.payload;
      state.currentQuestionIndex = 0;
      state.userAnswers = Array(state.questions.length).fill(null);
      state.quizCompleted = false;
      state.score = 0;
      state.isTimeUp = false;
      state.timeUpQuestions = [];
    },
    setTimeUp: (state, action: PayloadAction<{ questionIndex: number }>) => {
      state.isTimeUp = true;
      // Add current question to timeUpQuestions array if not already there
      if (!state.timeUpQuestions.includes(action.payload.questionIndex)) {
        state.timeUpQuestions.push(action.payload.questionIndex);
      }
    },
  },
});

export const {
  setAnswer,
  nextQuestion,
  previousQuestion,
  completeQuiz,
  resetQuiz,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // @ts-ignore
   setQuiz, // @ts-ignore
  setTimeUp,
} = quizSlice.actions;


export default quizSlice.reducer;
