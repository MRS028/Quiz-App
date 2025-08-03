import { configureStore } from "@reduxjs/toolkit";
import { quizSlice } from "./features/quizSlices";
import { timerSlice } from "./features/timerSlice";

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("quizState");
    if (serializedState === null) {
      return undefined; // fallback to initialState
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("quizState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const store = configureStore({
  reducer: {
    quiz: quizSlice.reducer,
    timer: timerSlice.reducer,
  },
  preloadedState: {
    quiz: loadState() || undefined,
  },
});

// Listen for state changes and save to localStorage
store.subscribe(() => {
  const state = store.getState();
  saveState(state.quiz); // Save only quiz slice
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
