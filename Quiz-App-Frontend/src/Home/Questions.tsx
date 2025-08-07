// Questions.tsx
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setAnswer } from "@/Redux/features/quizSlices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizControl from "./QuizControl";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Questions() {
  const dispatch = useAppDispatch();

  // Redux state logic remains unchanged
  const { questions, currentQuestionIndex, userAnswers, timeUpQuestions } =
    useAppSelector((state) => state.quiz);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const isQuestionTimeUp = timeUpQuestions.includes(currentQuestionIndex);

  // Event handler logic remains unchanged
  const handleAnswerChange = (answer: string) => {
    if (!isQuestionTimeUp) {
      dispatch(
        setAnswer({
          questionIndex: currentQuestionIndex,
          answer,
        })
      );
    }
  };

  return (
    <div className="flex justify-center items-start  mt-10 md:mt-16 px-4">
      <Card className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-slate-900/80 border border-slate-700 shadow-2xl shadow-black/20 backdrop-blur-sm">
        <CardHeader className="mb-4">
          <CardTitle className="flex items-start gap-4 text-xl md:text-2xl text-gray-100 font-bold">
            <span className="flex items-center justify-center bg-teal-500 text-slate-900 rounded-full font-bold w-8 h-8 md:w-10 md:h-10 text-lg flex-shrink-0 mt-1">
              {currentQuestionIndex + 1}
            </span>
            <span>{currentQuestion.question}</span>
          </CardTitle>
          {isQuestionTimeUp && (
            <div className="flex items-center gap-2 text-red-400 font-semibold mt-3 ml-12 md:ml-14">
                <XCircle className="w-5 h-5"/>
                <span>Time's Up! Your answer was not recorded.</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, i) => {
            const isSelected = currentAnswer === option;
            return (
              <Button
                key={i}
                variant={isSelected ? "default" : "outline"}
                onClick={() => handleAnswerChange(option)}
                className={`w-full justify-between items-center text-left p-6 md:p-7 text-base rounded-lg transition-all duration-200
                  ${
                    isSelected
                      ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-500"
                      : "bg-slate-800/70 border-slate-700 hover:bg-slate-700/80 hover:border-teal-500 text-gray-300"
                  }
                  ${isQuestionTimeUp ? "opacity-60 cursor-not-allowed" : ""}
                `}
                disabled={isQuestionTimeUp}
              >
                <span className="font-medium">{option}</span>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-white" />}
              </Button>
            );
          })}
        </CardContent>

        {/* QuizControl component is placed in a visually distinct footer area */}
        <div className="mt-8 border-t border-slate-700 pt-6">
          <QuizControl />
        </div>
      </Card>
    </div>
  );
}
