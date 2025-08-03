
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  startTime: number | null;
  totalDuration: number; // in seconds
}

const initialState: TimerState = {
  startTime: null,
  totalDuration: 0,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<number>) => {
      state.startTime = action.payload; // timestamp
      localStorage.setItem("quizStartTime", action.payload.toString());
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.totalDuration = action.payload;
    },
    resetTimer: (state) => {
      state.startTime = null;
      state.totalDuration = 0;
      localStorage.removeItem("quizStartTime");
    },
  },
});

export const { startTimer, setDuration, resetTimer } = timerSlice.actions;
export default timerSlice.reducer;
