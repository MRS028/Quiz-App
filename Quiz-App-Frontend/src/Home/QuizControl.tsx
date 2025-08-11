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
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

// Custom styled SweetAlert2 configuration
const themedSwal = Swal.mixin({
  background: "#1e293b", // slate-800
  color: "#e2e8f0", // slate-200
  customClass: {
    popup: "border border-slate-700 rounded-xl",
    confirmButton:
      "bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded",
    timerProgressBar: "bg-teal-500",
  },
  buttonsStyling: false,
});

export default function QuizControl() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // All Redux and state logic remains unchanged
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
    const saved = localStorage.getItem(
      `quiz_timer_end_${currentQuestionIndex}`
    );
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    const newEndTime = Date.now() + TIMER_DURATION * 1000;
    localStorage.setItem(
      `quiz_timer_end_${currentQuestionIndex}`,
      newEndTime.toString()
    );
    return newEndTime;
  };

  const [endTime, setEndTime] = useState(getEndTime);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((endTime - Date.now()) / 1000))
  );

  // All useEffect hooks for timer logic remain unchanged
  // QuizControl.tsx (updated parts only)
  useEffect(() => {
    if (isQuestionTimeUp && !quizCompleted) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          dispatch(nextQuestion());
        } else {
          dispatch(completeQuiz());
          themedSwal
            .fire({
              title: "Quiz Submitted!",
              text: "Your answers have been automatically submitted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            })
            .then(() => {
              navigate("/quiz");
            });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    isQuestionTimeUp,
    currentQuestionIndex,
    questions.length,
    dispatch,
    quizCompleted,
    navigate,
  ]);

  useEffect(() => {
    if (isQuestionTimeUp || quizCompleted) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      // Auto proceed if answered but not submitted
      if (remaining === 0 && isAnswered) {
        if (currentQuestionIndex < questions.length - 1) {
          dispatch(nextQuestion());
        } else {
          dispatch(completeQuiz());
          themedSwal
            .fire({
              title: "Quiz Submitted!",
              text: "Your answers have been automatically submitted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            })
            .then(() => {
              navigate("/quiz");
            });
        }
        clearInterval(interval);
        return;
      }

      if (remaining === 0) {
        dispatch(setTimeUp({ questionIndex: currentQuestionIndex }));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    endTime,
    isQuestionTimeUp,
    quizCompleted,
    dispatch,
    currentQuestionIndex,
    isAnswered,
    questions.length,
    navigate,
  ]);

  useEffect(() => {
    if (quizCompleted) return;
    const saved = localStorage.getItem(
      `quiz_timer_end_${currentQuestionIndex}`
    );
    const savedParsed = saved ? parseInt(saved, 10) : 0;
    if (!saved || isNaN(savedParsed) || savedParsed <= Date.now()) {
      const newEndTime = Date.now() + TIMER_DURATION * 1000;
      localStorage.setItem(
        `quiz_timer_end_${currentQuestionIndex}`,
        newEndTime.toString()
      );
      setEndTime(newEndTime);
      setTimeLeft(TIMER_DURATION);
    } else {
      setEndTime(savedParsed);
      setTimeLeft(Math.max(0, Math.floor((savedParsed - Date.now()) / 1000)));
    }
  }, [currentQuestionIndex, quizCompleted]);

  // All handler functions remain unchanged
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
      themedSwal
        .fire({
          title: "Quiz Submitted!",
          text: "You will be redirected to the summary page.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
          timerProgressBar: true,
        })
        .then(() => {
          navigate("/quiz");
        });
    }
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  const getTimerColor = () => {
    if (timeLeft > 15) return "text-teal-400";
    if (timeLeft > 5) return "text-amber-400";
    return "text-red-500 animate-pulse";
  };

  return (
    <div className="space-y-6">
      {/* Progress and Timer Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm font-medium text-gray-200">
          <span>Progress</span>
          <span >
            Question <span className="text-red-500">{currentQuestionIndex + 1}</span> of <span className="text-red-500">{questions.length}</span>
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-teal-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className={`font-semibold text-lg ${getTimerColor()}`}>
            Time Left: {timeLeft}s
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          variant={"outline"}
          disabled={currentQuestionIndex === 0 || quizCompleted}
          className="px-6 py-5 bg-slate-700 hover:bg-slate-600 text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {currentQuestionIndex < questions.length - 1 && !quizCompleted && (
          <Button
            onClick={handleNext}
            variant={"outline"}
            disabled={!isAnswered && !isQuestionTimeUp}
            className="px-6 py-5 bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}

        {currentQuestionIndex === questions.length - 1 && !quizCompleted && (
          <Button
            onClick={handleComplete}
            disabled={!isAnswered && !isQuestionTimeUp}
            className="px-6 py-5 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
            <CheckCheck className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>

      {/* Status Messages */}
      <div className="h-6 text-center">
        {isQuestionTimeUp && (
          <p className="flex items-center justify-center gap-2 text-sm text-red-400 font-semibold">
            <Info className="w-4 h-4" />
            Time's up!{" "}
            {currentQuestionIndex < questions.length - 1
              ? "Moving to next question..."
              : "Submitting quiz..."}
          </p>
        )}
        {!isAnswered && !isQuestionTimeUp && (
          <p className="flex items-center justify-center gap-2 text-sm text-amber-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Please select an answer to proceed
          </p>
        )}
      </div>
    </div>
  );
}
