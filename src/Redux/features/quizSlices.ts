import { quizData1, quizData2,quizData3 } from "@/Home/quizData";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const allQuizData = [quizData1, quizData2, quizData3];
const quizData = allQuizData[Math.floor(Math.random() * allQuizData.length)];
interface QuizState {
  questions: typeof quizData;
  currentQuestionIndex: number;
  userAnswers: (string | null)[];
  quizCompleted: boolean;
  score: number;
}

const initialState: QuizState = {
  questions: quizData,
  currentQuestionIndex: 0,
  userAnswers: Array(quizData.length).fill(null),
  quizCompleted: false,
  score: 0,
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
      state.userAnswers[questionIndex] = answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
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
        return acc + (answer === state.questions[index].answer ? 1 : 0);
      }, 0);
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.userAnswers = Array(state.questions.length).fill(null);
      state.quizCompleted = false;
      state.score = 0;
    },
  },
});

export const {
  setAnswer,
  nextQuestion,
  previousQuestion,
  completeQuiz,
  resetQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
