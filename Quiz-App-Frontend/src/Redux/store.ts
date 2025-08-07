// Redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { quizSlice } from "./features/quizSlices";
// import timerReducer from "@/Redux/features/timerSlice";
import { quizApi } from "./api/quizApi";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("quizState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

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
    // timer: timerReducer,
    [quizApi.reducerPath]: quizApi.reducer,
  },
  preloadedState: {
    quiz: loadState() || undefined,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(quizApi.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state.quiz);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
