import { setUserInfo } from "@/Redux/features/quizSessionSlice";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useStartQuizSessionMutation } from "@/Redux/api/quizApi"; // Import the mutation

export default function StartQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [startQuizSession] = useStartQuizSessionMutation(); // Destructure the mutation hook

  const handleStart = async () => { // Make handleStart async
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const className = (document.getElementById("className") as HTMLInputElement).value;

    if (!name || !className) {
      alert("Please enter both name and class!");
      return;
    }

    try {
      // Call the startQuizSession mutation
      const response = await startQuizSession({ name, className }).unwrap();
      const sessionId = response.sessionId; // Assuming the server returns { sessionId: "..." }

      if (sessionId) {
        localStorage.setItem("quizSessionId", sessionId); // Store sessionId in localStorage
        dispatch(setUserInfo({ name, className }));
        navigate("/quiz");
      } else {
        console.error("Session ID not received from server.");
        alert("Failed to start quiz session. Please try again.");
      }
    } catch (error) {
      console.error("Error starting quiz session:", error);
      alert("Failed to start quiz session. Please try again.");
    }
  };

  return (
    <div>
      <input id="name" placeholder="Enter your name" />
      <input id="className" placeholder="Enter your class" />
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
}
