import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetQuiz } from "@/Redux/features/quizSlices";
import { resetTimer } from "@/Redux/features/timerSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

// 🔍 Function to determine rating status and color
const getRatingStatus = (percentage: number) => {
  if (percentage < 40) return { label: "Poor", color: "text-red-600" };
  else if (percentage < 60)
    return { label: "Needs Improvement", color: "text-orange-500" };
  else if (percentage < 70) return { label: "Fair", color: "text-yellow-600" };
  else if (percentage < 80) return { label: "Good", color: "text-green-500" };
  else return { label: "Excellent", color: "text-emerald-600" };
};

export default function QuizSummary() {
  const { quizCompleted, userAnswers, questions } = useAppSelector(
    (state) => state.quiz
  );
  console.log(questions);
  const navigate = useNavigate();
  const totalQuestions = questions.length;
  const dispatch = useAppDispatch();

  if (!quizCompleted) {
    return (
      <div className="text-center text-red-600 mt-10 font-medium">
        ⚠️ Please complete the quiz to see the summary.
      </div>
    );
  }

  if (totalQuestions === 0) {
    return (
      <div className="text-center text-yellow-600 mt-10 font-medium">
        ❗ No questions available for the quiz.
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const scoreText = `${correctAnswers} out of ${totalQuestions} (${percentage}%)`;
  const skippedAnswers = userAnswers.filter(
    (answer) => answer === "Not Answered" || answer === undefined
  ).length;

  const tips = [
    "🔍 Review the questions you got wrong.",
    "📚 Practice similar questions to strengthen your knowledge.",
    "⏱️ Consider taking a timed quiz to improve your speed.",
  ];

  // 🟢 Determine progress bar color based on percentage
  let progressColor = "bg-red-500";
  if (percentage >= 80) {
    progressColor = "bg-green-500";
  } else if (percentage >= 40) {
    progressColor = "bg-yellow-400";
  }

  // ✅ Get rating label & color
  const rating = getRatingStatus(percentage);
  const handleReset = () => {
    dispatch(resetQuiz());
    dispatch(resetTimer());
    localStorage.removeItem("quizState");
    localStorage.removeItem("quizStartTime");
    window.location.reload();
  };

  const handleExplanation = () => {
    navigate("/explanation");
  };

  return (
    <>
      <div className="flex justify-center items-center mt-12 px-4">
        <Card className="w-full max-w-3xl shadow-xl border border-gray-200 rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-blue-800">
              🎉 Quiz Summary
            </CardTitle>
            <p className="mt-2 text-center text-gray-600">
              Thanks for completing the quiz! Here's how you did:
            </p>
          </CardHeader>

          <CardContent className="space-y-6 mt-4">
            {/* Score Overview */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-lg font-semibold text-green-600">
                ✅ Score: {percentage}%
              </p>

              <div className="relative w-full bg-blue-100 rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className={clsx(
                    "h-4 rounded-full transition-all duration-500",
                    progressColor
                  )}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <p className="text-sm mt-2 text-gray-700">{scoreText}</p>

              {/* ⭐ Rating Display */}
              <p className={clsx("text-sm mt-1 font-medium", rating.color)}>
                ⭐ Rating: {rating.label}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-green-200 p-3 rounded-lg font-semibold text-green-800 shadow-sm">
                ✅ Correct: {correctAnswers}
              </div>
              <div className="bg-red-100 p-3 rounded-lg font-semibold text-red-800 shadow-sm">
                ❌ Incorrect: {incorrectAnswers}
              </div>
              <div className="bg-red-100 p-3 rounded-lg font-semibold text-blue-800 shadow-sm">
                ⛔ Skipped: {skippedAnswers}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg font-semibold text-black shadow-sm">
                📋 Total: {totalQuestions}
              </div>
            </div>
            <div className="text-center mt-4">
              {/* <h2>Quiz Summary</h2> */}
              {/* Your summary content */}
              <button
                className="bg-green-500 font-semibold hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleExplanation}
              >
                View Explanation
              </button>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-semibold text-yellow-700 mb-2">
                💡 Tips for Improvement:
              </p>
              <ul className="text-sm list-inside text-gray-700 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Final Message */}
            <div className="text-center text-sm md:text-xl text-green-700 font-medium">
              🎯 Great job on completing the quiz!
            </div>
          </CardContent>
        </Card>
      </div>
      <div className=" mb-10 mt-6 text-center">
        <p className="text-center text-gray-600 mt-4">
          <strong>Want to try again? </strong>{" "}
          <Link
            to="/"
            onClick={handleReset}
            className="text-green-500 font-semibold"
          >
            Start a new quiz
          </Link>
        </p>
      </div>
    </>
  );
}
