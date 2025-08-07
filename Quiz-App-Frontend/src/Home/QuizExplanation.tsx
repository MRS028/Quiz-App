import { useAppSelector } from "../Redux/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, SkipForward } from "lucide-react";
import useScrollToTop from "@/hooks/useScrollToTop";

// A reusable component for displaying an answer line with an icon
const AnswerLine = ({
  label,
  answer,
  icon,
  className,
}: {
  label: string;
  answer: string | null;
  icon: React.ReactNode;
  className: string;
}) => (
  <div className="flex items-start gap-3">
    <div className={`mt-1 ${className}`}>{icon}</div>
    <div>
      <span className="font-semibold text-gray-400">{label}:</span>{" "}
      <span className={`font-medium ${className}`}>
        {answer || "Not Answered"}
      </span>
    </div>
  </div>
);

export default function QuizExplanation() {
  useScrollToTop();
  const navigate = useNavigate();
  const { questions, userAnswers } = useAppSelector((state) => state.quiz);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header and Navigation */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl text-center md:text-4xl font-extrabold text-gray-100">
            Answer Review
          </h1>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-slate-800/80 border-slate-600 hover:bg-slate-700 hover:text-teal-400 text-gray-300"
            onClick={() => navigate("/")} // Navigate to summary instead of home for better UX
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Explanation List */}
        <div className="space-y-6">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div
                key={q.id || index} // Use index as fallback for key
                className="border border-slate-700 rounded-xl bg-slate-800/50 shadow-lg"
              >
                {/* Question Header */}
                <div className="p-4 sm:p-6 border-b border-slate-700">
                  <p className="text-lg font-bold text-gray-200 flex items-start gap-3">
                    <span className="flex items-center justify-center bg-slate-700 text-teal-400 rounded-full font-bold w-7 h-7 text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{q.question}</span>
                  </p>
                </div>

                {/* Answers and Explanation Body */}
                <div className="p-4 sm:p-6 space-y-4">
                  {isCorrect ? (
                    <AnswerLine
                      label="Your Answer"
                      answer={userAnswer}
                      icon={<CheckCircle2 className="w-5 h-5" />}
                      className="text-emerald-400"
                    />
                  ) : (
                    <>
                      <AnswerLine
                        label="Your Answer"
                        answer={userAnswer}
                        icon={userAnswer ? <XCircle className="w-5 h-5" /> : <SkipForward className="w-5 h-5" />}
                        className={userAnswer ? "text-red-400" : "text-sky-400"}
                      />
                      <AnswerLine
                        label="Correct Answer"
                        answer={q.correctAnswer}
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        className="text-emerald-400"
                      />
                    </>
                  )}
                  
                  {/* Mock Explanation */}
                  {/* {q.explanation && (
                     <div className="pt-4 border-t border-slate-700/50">
                        <div className="flex items-start gap-3 text-gray-400">
                            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-amber-300 mb-1">Explanation</h4>
                                <p className="text-sm leading-relaxed">{q.explanation}</p>
                            </div>
                        </div>
                     </div>
                  )} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
