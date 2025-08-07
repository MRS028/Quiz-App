import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "./Home/Questions";
import QuizSummary from "./Home/QuizSummary";
import { useAppSelector } from "./Redux/hooks";
import Home from "./Home/Home";
import Footer from "./Home/footer";
import QuizExplanation from "./Home/QuizExplanation";
import NotFound from "./Home/NotFound";

function App() {
  const { quizCompleted } = useAppSelector((state) => state.quiz);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/quiz"
              element={!quizCompleted ? <Questions /> : <QuizSummary />}
            />
            <Route path="/explanation" element={<QuizExplanation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
