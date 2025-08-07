// QuizControl.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  completeQuiz,
  nextQuestion,
  previousQuestion,
  setTimeUp,
} from "@/Redux/features/quizSlices";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function QuizControl() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    currentQuestionIndex,
    userAnswers,
    questions,
    quizCompleted,
    timeUpQuestions,
  } = useAppSelector((state) => state.quiz);

  const isAnswered = userAnswers[currentQuestionIndex] !== null;
  const isQuestionTimeUp = timeUpQuestions.includes(currentQuestionIndex);
  const TIMER_DURATION = 50;

  const getEndTime = () => {
    const saved = localStorage.getItem(`quiz_timer_end_${currentQuestionIndex}`);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    const newEndTime = Date.now() + TIMER_DURATION * 1000;
    localStorage.setItem(`quiz_timer_end_${currentQuestionIndex}`, newEndTime.toString());
    return newEndTime;
  };

  const [endTime, setEndTime] = useState(getEndTime);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((endTime - Date.now()) / 1000))
  );

  // Auto move or submit when time is up
  useEffect(() => {
    if (isQuestionTimeUp && !quizCompleted) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          dispatch(nextQuestion());
        } else {
          dispatch(completeQuiz());
          Swal.fire({
            title: "Time's Up!",
            text: "Quiz has been automatically submitted.",
            icon: "info",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate("/quiz");
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isQuestionTimeUp, currentQuestionIndex, questions.length, dispatch, quizCompleted, navigate]);

  // Timer tick
  useEffect(() => {
    if (isQuestionTimeUp || quizCompleted) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        dispatch(setTimeUp({ questionIndex: currentQuestionIndex }));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, isQuestionTimeUp, quizCompleted, dispatch, currentQuestionIndex]);

  // Reset timer on question change
  useEffect(() => {
    if (quizCompleted) return;

    const saved = localStorage.getItem(`quiz_timer_end_${currentQuestionIndex}`);
    const savedParsed = saved ? parseInt(saved, 10) : 0;

    if (!saved || isNaN(savedParsed) || savedParsed <= Date.now()) {
      const newEndTime = Date.now() + TIMER_DURATION * 1000;
      localStorage.setItem(`quiz_timer_end_${currentQuestionIndex}`, newEndTime.toString());
      setEndTime(newEndTime);
      setTimeLeft(TIMER_DURATION);
    } else {
      setEndTime(savedParsed);
      setTimeLeft(Math.max(0, Math.floor((savedParsed - Date.now()) / 1000)));
    }
  }, [currentQuestionIndex, quizCompleted]);

  const handleNext = () => {
    if ((isAnswered || isQuestionTimeUp) && !quizCompleted) {
      dispatch(nextQuestion());
    }
  };

  const handlePrevious = () => {
    if (!quizCompleted) {
      dispatch(previousQuestion());
    }
  };

  const handleComplete = () => {
    if (!quizCompleted) {
      dispatch(completeQuiz());
      Swal.fire({
        title: "Quiz Submitted!",
        text: "You will be redirected to the summary page.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        navigate("/quiz");
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md shadow">
        <h3 className="text-md font-semibold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Time Left:</span>
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border-4 text-sm font-bold ${
              timeLeft > 10
                ? "border-green-500"
                : timeLeft > 0
                ? "border-yellow-500"
                : "border-red-500"
            }`}
          >
            {timeLeft > 0 ? timeLeft : "⏰"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          className="w-24"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || quizCompleted}
        >
          Previous
        </Button>

        {currentQuestionIndex < questions.length - 1 && !quizCompleted && (
          <Button
            className="w-24"
            onClick={handleNext}
            disabled={!isAnswered && !isQuestionTimeUp}
          >
            Next
          </Button>
        )}

        {currentQuestionIndex === questions.length - 1 && !quizCompleted && (
          <Button
            className="w-24"
            onClick={handleComplete}
            disabled={!isAnswered && !isQuestionTimeUp}
          >
            Submit
          </Button>
        )}
      </div>

      {isQuestionTimeUp && (
        <p className="text-sm text-red-500 mt-2">
          ⏱️ Time's up! {currentQuestionIndex < questions.length - 1
            ? "Moving to next question..."
            : "Submitting quiz..."}
        </p>
      )}
      {!isAnswered && !isQuestionTimeUp && (
        <p className="text-sm text-center font-semibold text-yellow-500 mt-2">
          Please select an answer to proceed
        </p>
      )}
    </div>
  );
}