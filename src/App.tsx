import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "./Home/Questions";
import QuizSummary from "./Home/QuizSummary";
import { useAppSelector } from "./Redux/hooks";
import Home from "./Home/Home";
import Footer from "./Home/footer";

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
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
        <Footer /> {/* 👈 Footer appears on all pages */}
      </div>
    </BrowserRouter>
  );
}

export default App;
