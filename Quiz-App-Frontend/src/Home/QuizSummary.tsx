import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetQuiz } from "@/Redux/features/quizSlices";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { MdLeaderboard } from "react-icons/md";
import {
  Check,
  X,
  SkipForward,
  HelpCircle,
  Trophy,
  Lightbulb,
  RotateCcw,
  FileText,
} from "lucide-react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useSubmitQuizResultMutation } from "@/Redux/api/quizApi";
import { useEffect, useState } from "react";

const getRatingStatus = (percentage: number) => {
  if (percentage < 40)
    return {
      label: "Needs Improvement",
      color: "text-red-400",
      icon: <Trophy className="w-5 h-5 text-red-500" />,
    };
  if (percentage < 70)
    return {
      label: "Good Effort",
      color: "text-amber-400",
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
    };
  return {
    label: "Excellent!",
    color: "text-emerald-400",
    icon: <Trophy className="w-5 h-5 text-emerald-500" />,
  };
};

const SummaryPlaceholder = ({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center gap-4 text-center mt-20 p-8 bg-slate-800/50 border border-slate-700 rounded-xl max-w-md mx-auto">
    <div className="text-amber-400">{icon}</div>
    <p className="text-xl font-medium text-gray-300">{message}</p>
    <Link to="/">
      <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
        Back to Home
      </Button>
    </Link>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}) => (
  <div className={`p-4 rounded-lg flex items-center gap-4 ${bgColor}`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  </div>
);

export default function QuizSummary() {
  const { quizCompleted, userAnswers, questions } = useAppSelector(
    (state) => state.quiz
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitQuizResult] = useSubmitQuizResultMutation();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useScrollToTop();

  if (!quizCompleted) {
    return (
      <SummaryPlaceholder
        icon={<HelpCircle size={40} />}
        message="Please complete the quiz to see the summary."
      />
    );
  }
  if (questions.length === 0) {
    return (
      <SummaryPlaceholder
        icon={<FileText size={40} />}
        message="No questions were available for this quiz."
      />
    );
  }

  const totalQuestions = questions.length;
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  const incorrectAnswers = userAnswers.filter(
    (answer, index) =>
      answer !== null && answer !== questions[index].correctAnswer
  ).length;
  const skippedAnswers = totalQuestions - correctAnswers - incorrectAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const rating = getRatingStatus(percentage);

  const getProgressColor = () => {
    if (percentage < 40) return "stroke-red-500";
    if (percentage < 70) return "stroke-amber-500";
    return "stroke-emerald-500";
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleReset = () => {
    dispatch(resetQuiz());
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("quiz_timer_end_")) {
        localStorage.removeItem(key);
      }
    });
    navigate("/");
  };
  const handleRank = () => {
    navigate("/leaderboard");
  };

  const handleSubmitResultToServer = async () => {
    if (!currentSessionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const resultData = {
        marks: correctAnswers,
        total: totalQuestions,
        percentage,
        answers: userAnswers,
      };

      // console.log("Submitting to:", `/quiz-sessions/${currentSessionId}/submit`);
      // console.log("Submitting data:", resultData);
      // @ts-ignore
      const response = await submitQuizResult({
        sessionId: currentSessionId,
        result: resultData,
      }).unwrap();

      // console.log("Result submitted successfully:", response);
      localStorage.removeItem("quizSessionId");
    } catch (error: any) {
      console.error("Full error details:", {
        status: error.status,
        data: error.data,
        originalError: error,
      });

      if (error.status === 400) {
        console.error("Validation error details:", error.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem("quizSessionId");
    if (storedSessionId) {
      setCurrentSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (quizCompleted && currentSessionId) {
      handleSubmitResultToServer();
    }
  }, [quizCompleted, currentSessionId]);

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-slate-900 text-gray-200">
      <Card className="w-full max-w-4xl bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-sm">
        <CardHeader className="text-center p-8 border-b border-slate-700">
          <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-100">
            Quiz Result
          </CardTitle>
          <p className="mt-2 text-gray-400">
            Here's a summary of your performance. Well done!
          </p>
        </CardHeader>

        <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                  className="stroke-slate-700"
                  strokeWidth="8"
                  fill="transparent"
                  r="56"
                  cx="60"
                  cy="60"
                />
                <circle
                  className={`transition-all duration-1000 ease-out ${getProgressColor()}`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  r="56"
                  cx="60"
                  cy="60"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {percentage}%
                </span>
                <span className="text-gray-400">Score</span>
              </div>
            </div>
            <div
              className={`mt-4 flex items-center gap-2 font-semibold ${rating.color}`}
            >
              {rating.icon}
              <span>{rating.label}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={<Check />}
                label="Correct"
                value={correctAnswers}
                bgColor="bg-emerald-500/20 text-emerald-300"
              />
              <StatCard
                icon={<X />}
                label="Incorrect"
                value={incorrectAnswers}
                bgColor="bg-red-500/20 text-red-300"
              />
              <StatCard
                icon={<SkipForward />}
                label="Skipped"
                value={skippedAnswers}
                bgColor="bg-sky-500/20 text-sky-300"
              />
              <StatCard
                icon={<HelpCircle />}
                label="Total"
                value={totalQuestions}
                bgColor="bg-slate-600/40 text-slate-300"
              />
            </div>

            <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-500/30">
              <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                <Lightbulb /> Tips for Improvement:
              </h3>
              <ul className="text-sm list-inside text-gray-300 space-y-1">
                <li>
                  Review the questions you got wrong using the explanation page.
                </li>
                <li>
                  Practice makes perfect! Try another quiz to solidify your
                  knowledge.
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/explanation")}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-black font-bold py-6 text-base"
              >
                <FileText className="w-5 h-5 mr-2" /> View Explanation
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 hover:text-teal-400 text-gray-900 font-bold py-6 text-base"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Try Another Quiz
              </Button>
              <Button
                onClick={handleRank}
                variant="outline"
                className="flex-1 border-slate-600 hover:bg-slate-700 hover:text-teal-400 text-gray-900 font-bold py-6 text-base"
              >
                <MdLeaderboard className="w-5 h-5 mr-2" /> See Leaderboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
