import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quizApi = createApi({
    reducerPath: "quizApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "http://localhost:5000/api"
     }),
     tagTypes: ["Quizzes","user","admin"],
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

    }),
    
});

export const { useAddQuizMutation ,useGetAllQuizzesQuery} = quizApi