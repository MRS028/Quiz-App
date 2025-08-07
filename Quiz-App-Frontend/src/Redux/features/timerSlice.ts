// Redux/features/timerSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  currentQuestionIndex: number;
  timePerQuestion: number; // in seconds
  startTime: number | null; // timestamp in ms
}

const LOCAL_START_TIME_KEY = "quizStartTime";
const LOCAL_QUESTION_INDEX_KEY = "quizQuestionIndex";

// Read from localStorage if exists
const storedStartTime = localStorage.getItem(LOCAL_START_TIME_KEY);
const storedQuestionIndex = localStorage.getItem(LOCAL_QUESTION_INDEX_KEY);

const initialState: TimerState = {
  currentQuestionIndex: storedQuestionIndex ? parseInt(storedQuestionIndex) : 0,
  timePerQuestion: 50, // ⏱️ 50 seconds per question
  startTime: storedStartTime ? parseInt(storedStartTime) : Date.now(),
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startQuestionTimer: (state, action: PayloadAction<{ index: number; timestamp: number }>) => {
      state.currentQuestionIndex = action.payload.index;
      state.startTime = action.payload.timestamp;
      localStorage.setItem(LOCAL_START_TIME_KEY, action.payload.timestamp.toString());
      localStorage.setItem(LOCAL_QUESTION_INDEX_KEY, action.payload.index.toString());
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      state.startTime = Date.now();
      localStorage.setItem(LOCAL_START_TIME_KEY, state.startTime.toString());
      localStorage.setItem(LOCAL_QUESTION_INDEX_KEY, state.currentQuestionIndex.toString());
    },
    resetTimer: (state) => {
      state.currentQuestionIndex = 0;
      state.startTime = Date.now();
      localStorage.removeItem(LOCAL_START_TIME_KEY);
      localStorage.removeItem(LOCAL_QUESTION_INDEX_KEY);
    },
  },
});

export const { startQuestionTimer, nextQuestion, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
