import { Button } from "@/components/ui/button";
import { completeQuiz, nextQuestion, previousQuestion } from "@/Redux/features/quizSlices";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

export default function QuizControl() {
  const { currentQuestionIndex, userAnswers, quizCompleted } = useAppSelector(
    (state) => state.quiz
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAnswered = userAnswers[currentQuestionIndex] !== null;

  const handleNext = () => {
    if (isAnswered) {
      dispatch(nextQuestion());
    } else {
      alert("Please select an answer before proceeding.");
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

 const handleComplete = () => {
  if (isAnswered) {
    dispatch(completeQuiz());

    Swal.fire({
      title: "Quiz Submitted!",
      text: "You will be redirected to the summary page.",
      icon: "success",
      timer: 1000,
      showConfirmButton: false, // Hide the OK button
      buttonsStyling: true,
      customClass: {
        confirmButton: "bg-green-600 text-white hover:bg-green-700",
      },
    }).then(() => {
      navigate("/summary"); // ✅ Navigate to summary
    });
  } else {
    alert("Please select an answer before completing the quiz.");
  }
};


  return (
    <div className="flex text-center items-center justify-between mt-4">
      <Button
        className="mb-2 p-2 flex flex-row items-center w-20"
        onClick={handlePrevious}
        disabled={currentQuestionIndex === 0 || quizCompleted}
      >
        Previous
      </Button>

      {currentQuestionIndex < userAnswers.length - 1 && !quizCompleted && (
        <Button
          className={
            isAnswered
              ? "mb-2 p-2 flex flex-row items-center w-20"
              : "mb-2 p-2 flex flex-row items-center w-20 opacity-50 cursor-not-allowed"
          }
          onClick={handleNext}
          disabled={quizCompleted && !isAnswered}
        >
          Next
        </Button>
      )}

      {currentQuestionIndex === userAnswers.length - 1 && !quizCompleted && (
        <Button
          className={
            isAnswered
              ? "mb-2 p-2 flex flex-row items-center w-20"
              : "mb-2 p-2 flex flex-row items-center w-20 opacity-50 cursor-not-allowed"
          }
          onClick={handleComplete}
          disabled={quizCompleted}
        >
          Submit
        </Button>
      )}
    </div>
  );
}
