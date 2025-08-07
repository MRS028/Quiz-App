import { useAppSelector } from "../Redux/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const QuizExplanation = () => {
  const navigate = useNavigate();
  const { questions, userAnswers } = useAppSelector((state) => state.quiz);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back to Home Button */}
      <div>
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold border-b pb-2 text-center">Answer Explanations</h2>

      {/* Explanation List */}
      {questions.map((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.correctAnswer;

        return (
          <div
            key={q.id}
            className="border rounded-lg p-4 shadow-md bg-white space-y-2"
          >
            <p className="text-lg font-semibold">
              {index + 1}. {q.question}
            </p>

            <p>
              <span className="font-medium">Your Answer:</span>{" "}
              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                {userAnswer || "Not Answered"}
              </span>
            </p>

            <p>
              <span className="font-medium">Correct Answer:</span>{" "}
              <span className="text-green-700 font-semibold">{q.correctAnswer}</span>
            </p>

            {/* {q.explanation && (
              <p className="text-gray-700">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )} */}
          </div>
        );
      })}
    </div>
  );
};

export default QuizExplanation;
