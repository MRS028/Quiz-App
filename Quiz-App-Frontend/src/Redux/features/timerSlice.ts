// Redux/features/timerSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  currentQuestionIndex: number;
  timePerQuestion: number; // in seconds
  startTime: number | null; // timestamp in ms
}

const initialState: TimerState = {
  currentQuestionIndex: 0,
  timePerQuestion: 60,
  startTime: null,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startQuestionTimer: (state, action: PayloadAction<{ index: number; timestamp: number }>) => {
      state.currentQuestionIndex = action.payload.index;
      state.startTime = action.payload.timestamp;
      localStorage.setItem("quizStartTime", action.payload.timestamp.toString());
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      state.startTime = Date.now();
      localStorage.setItem("quizStartTime", state.startTime.toString());
    },
    resetTimer: (state) => {
      state.currentQuestionIndex = 0;
      state.startTime = null;
      localStorage.removeItem("quizStartTime");
    },
  },
});

export const { startQuestionTimer, nextQuestion, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
