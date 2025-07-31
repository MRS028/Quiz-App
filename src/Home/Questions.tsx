import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setAnswer, completeQuiz } from "@/Redux/features/quizSlices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizControl from "./QuizControl";

export default function Questions() {
  const dispatch = useAppDispatch();

  const { questions, currentQuestionIndex, userAnswers } = useAppSelector(
    (state) => state.quiz
  );

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];

  const totalTime = questions.length * 60; // total seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      dispatch(completeQuiz());
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, dispatch]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Progress in percentage (0-100)
  const progressPercent = (timeLeft / totalTime) * 100;

  const handleAnswerChange = (answer: string) => {
    dispatch(
      setAnswer({
        questionIndex: currentQuestionIndex,
        answer,
      })
    );
  };

  return (
    <div className="flex justify-center items-center mt-20 px-2">
        <Card className="w-full max-w-2xl mx-auto mt-10 p-6 shadow-lg space-y-6">
      {/* Timer and Progress Bar */}
      <div>
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
          <span>Time Left: {formatTime(timeLeft)}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded h-3">
          <div
            className="bg-gray-700 h-3 rounded transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Question {currentQuestion.id}: {currentQuestion.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {currentQuestion.options.map((option, i) => (
          <Button
            key={i}
            variant={currentAnswer === option ? "default" : "outline"}
            onClick={() => handleAnswerChange(option)}
            className="w-full justify-start text-left px-4 py-2"
          >
            {i + 1}. {option}
          </Button>
        ))}
      </CardContent>

      <div className="mt-6">
        <QuizControl />
      </div>
    </Card>
    </div>
  );
}
