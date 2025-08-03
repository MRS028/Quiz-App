import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { completeQuiz } from "@/Redux/features/quizSlices";

export default function Timer() {
  const dispatch = useAppDispatch();
  const { questions } = useAppSelector((state) => state.quiz);

  const totalTime = questions.length * 60; // total seconds

  const getStartTime = () => {
    const saved = localStorage.getItem("quizStartTime");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    const now = Date.now();
    localStorage.setItem("quizStartTime", now.toString());
    return now;
  };

  const [startTime] = useState(getStartTime());
  const calculateTimeLeft = () =>
    Math.max(0, Math.floor((startTime + totalTime * 1000 - Date.now()) / 1000));
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem("quizStartTime");
        dispatch(completeQuiz());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, startTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = (timeLeft / totalTime) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span className="text-red-600">Time Left: {formatTime(timeLeft)}</span>
        <span className="text-red-600">{Math.round(progressPercent)}%</span>
      </div>
      <div className="w-full bg-gray-300 rounded h-3">
        <div
          className="bg-gray-700 h-3 rounded transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
