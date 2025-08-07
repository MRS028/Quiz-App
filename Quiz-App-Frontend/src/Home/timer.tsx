// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../Redux/hooks";
// import { completeQuiz } from "@/Redux/features/quizSlices";
// import { nextQuestion } from "@/Redux/features/timerSlice";

// export default function Timer() {
//   const dispatch = useAppDispatch();
//   const { questions } = useAppSelector((state) => state.quiz);
//   const { currentQuestionIndex, timePerQuestion, startTime } = useAppSelector(
//     (state) => state.timer
//   );

//   const calculateTimeLeft = () =>
//     Math.max(0, Math.floor((startTime! + timePerQuestion * 1000 - Date.now()) / 1000));

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const remaining = calculateTimeLeft();
//       setTimeLeft(remaining);

//       if (remaining <= 0) {
//         clearInterval(interval);
//         if (currentQuestionIndex + 1 >= questions.length) {
//           dispatch(completeQuiz());
//         } else {
//           dispatch(nextQuestion());
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [currentQuestionIndex, dispatch, startTime]);

//   const formatTime = (seconds: number) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   const progressPercent = (timeLeft / timePerQuestion) * 100;
//   const isDanger = timeLeft <= 10;

//   return (
//     <div className="w-full mb-6 space-y-2">
//       {/* Top bar with time and question info */}
//       <div className="flex items-center justify-between text-sm md:text-base font-semibold">
//         <span className={`text-gray-700`}>
//           Question {currentQuestionIndex + 1} of {questions.length}
//         </span>
//         <span
//           className={`font-mono text-lg md:text-xl ${
//             isDanger ? "text-red-600 animate-pulse" : "text-green-700"
//           }`}
//         >
//           ⏳ {formatTime(timeLeft)}
//         </span>
//       </div>

//       {/* Progress bar */}
//       <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
//         <div
//           className={`h-3 rounded-full transition-all duration-500 ${
//             isDanger ? "bg-red-500" : "bg-green-600"
//           }`}
//           style={{ width: `${progressPercent}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// }
