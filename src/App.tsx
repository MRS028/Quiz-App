
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Questions from "./Home/Questions";
import QuizSummary from "./Home/QuizSummary";
import { useAppSelector } from "./Redux/hooks";
import Home from "./Home/Home";

function App() {
  const { quizCompleted } = useAppSelector((state) => state.quiz);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Quiz route will show either Questions or Summary depending on quizCompleted */}
        <Route
          path="/quiz"
          element={!quizCompleted ? <Questions /> : <QuizSummary />}
        />
        {/* Optional: catch-all route or 404 page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
