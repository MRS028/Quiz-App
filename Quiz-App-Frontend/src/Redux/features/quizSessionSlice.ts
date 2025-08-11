import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface QuizSessionState {
  name: string;
  className: string;
}

const initialState: QuizSessionState = {
  name: "",
  className: ""
};

const quizSessionSlice = createSlice({
  name: "quizSession",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{ name: string; className: string }>
    ) => {
      state.name = action.payload.name;
      state.className = action.payload.className;
    },
    clearUserInfo: (state) => {
      state.name = "";
      state.className = "";
    }
  }
});

export const { setUserInfo, clearUserInfo } = quizSessionSlice.actions;
export default quizSessionSlice.reducer;
