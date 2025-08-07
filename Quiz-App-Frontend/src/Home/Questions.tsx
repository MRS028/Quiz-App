// Questions.tsx
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setAnswer } from "@/Redux/features/quizSlices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizControl from "./QuizControl";

export default function Questions() {
  const dispatch = useAppDispatch();

  const { questions, currentQuestionIndex, userAnswers, timeUpQuestions } =
    useAppSelector((state) => state.quiz);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const isQuestionTimeUp = timeUpQuestions.includes(currentQuestionIndex);

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
    <div className="flex justify-center items-center mt-16 px-2">
      <Card className="w-full max-w-2xl mx-auto mt-10 p-3 md:p-6 shadow-lg space-y-6">
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl text-left font-bold">
            {currentQuestionIndex + 1}. {currentQuestion.question}
            {isQuestionTimeUp && (
              <span className="text-red-500 ml-2">(Time's Up!)</span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, i) => (
            <Button
              key={i}
              variant={currentAnswer === option ? "default" : "outline"}
              onClick={() => handleAnswerChange(option)}
              className="w-full justify-start text-left px-4 py-2"
              disabled={isQuestionTimeUp}
            >
              {i + 1}. {option}
              {currentAnswer === option && <span className="ml-2">✓</span>}
            </Button>
          ))}
        </CardContent>

        <div>
          <QuizControl />
        </div>
      </Card>
    </div>
  );
}