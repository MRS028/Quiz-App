
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/Redux/hooks";
import { resetQuiz } from "@/Redux/features/quizSlices";
// import { resetTimer } from "@/Redux/features/timerSlice";
import AddQuiz from "./AddQuiz";
import AllQuiz from "./AllQuiz";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleStartQuiz = () => {
    navigate("/quiz");
    dispatch(resetQuiz());
    // dispatch(resetTimer());
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 px-4">
      <section className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">
          Welcome to the Quiz App 🎓
        </h1>
        <p className="text-lg text-gray-600">
          Test your knowledge with fun and challenging quizzes. Track your
          progress and improve every day!
        </p>
        <Button
          onClick={handleStartQuiz}
          className="text-lg px-6 py-3 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition duration-300"
        >
          Start Quiz
        </Button>
      </section>
      <section>
        <AddQuiz></AddQuiz>
        <AllQuiz></AllQuiz>
      </section>
    </main>
  );
}
