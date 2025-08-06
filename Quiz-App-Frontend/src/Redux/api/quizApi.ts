import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
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
    
  }),
});

export const { useAddQuizMutation, useGetAllQuizzesQuery } = quizApi;
