import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api",
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Quizzes", "user", "admin"],
  endpoints: (builder) => ({
    addQuiz: builder.mutation({
      query: (quiz) => ({
        url: "/quizzes",
        method: "POST",
        body: quiz,
      }),
      invalidatesTags: ["Quizzes"],
    }),
    getAllQuizzes: builder.query({
      query: () => "/quizzes",
      providesTags: ["Quizzes"],
    }),
    updateQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quizzes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),
    startQuizSession: builder.mutation({
      query: (sessionData) => ({
        url: "/quiz-sessions",
        method: "POST",
        body: sessionData,
      }),
    }),
    submitQuizResult: builder.mutation({
      query: ({ sessionId, result }) => ({
        url: `quiz-sessions/${sessionId}/submit`, // Note the URL pattern
        method: "POST",
        body: result,
      }),
    }),
  }),
});

export const {
  useAddQuizMutation,
  useGetAllQuizzesQuery,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useStartQuizSessionMutation,
  useSubmitQuizResultMutation,
} = quizApi;
