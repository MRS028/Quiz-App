import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddQuizMutation } from "@/Redux/api/quizApi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

type QuizData = {
  title: string;
  description: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
};

// Extract question modal to its own component
function QuestionModal({
  open,
  setOpen,
  onAddQuestion,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddQuestion: (question: any) => void;
}) {
  const [addQuestionStep, setAddQuestionStep] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    optionIndex?: number
  ) => {
    const { value } = e.target;
    if (field === "question") {
      setNewQuestion((prev) => ({ ...prev, question: value }));
    } else if (field === "option" && optionIndex !== undefined) {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[optionIndex] = value;
      setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
    }
  };

  const handleCorrectAnswerSelect = (answer: string) => {
    setNewQuestion((prev) => ({ ...prev, correctAnswer: answer }));
  };

  const addQuestion = () => {
    onAddQuestion(newQuestion);
    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setOpen(false);
    setAddQuestionStep(1);
  };

  // Validate if we can move to next step
  const canProceedToNextStep = () => {
    if (addQuestionStep === 1) {
      return newQuestion.question.trim() !== "";
    } else if (addQuestionStep === 2) {
      return newQuestion.options.every((option) => option.trim() !== "");
    }
    return true;
  };

  // Validate if we can add the question
  const canAddQuestion = () => {
    return (
      newQuestion.correctAnswer !== "" &&
      newQuestion.options.includes(newQuestion.correctAnswer)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Step {addQuestionStep}:{" "}
            {addQuestionStep === 1
              ? "Question"
              : addQuestionStep === 2
              ? "Options"
              : "Correct Answer"}
          </DialogDescription>
        </DialogHeader>
        {addQuestionStep === 1 && (
          <Input
            placeholder="Enter question"
            value={newQuestion.question}
            onChange={(e) => handleInputChange(e, "question")}
          />
        )}
        {addQuestionStep === 2 &&
          newQuestion.options.map((option, i) => (
            <Input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={option}
              onChange={(e) => handleInputChange(e, "option", i)}
            />
          ))}
        {addQuestionStep === 3 && (
          <div>
            <Label>Correct Answer</Label>
            <select
              title="Select correct answer"
              value={newQuestion.correctAnswer}
              onChange={(e) => handleCorrectAnswerSelect(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md"
            >
              <option value="">Select correct answer</option>
              {newQuestion.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <DialogFooter>
          {addQuestionStep > 1 && (
            <Button onClick={() => setAddQuestionStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {addQuestionStep < 3 ? (
            <Button
              onClick={() => setAddQuestionStep((s) => s + 1)}
              disabled={!canProceedToNextStep()}
            >
              Next
            </Button>
          ) : (
            <Button onClick={addQuestion} disabled={!canAddQuestion()}>
              Add Question
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AddQuiz() {
  const [addQuiz, { isLoading }] = useAddQuizMutation();
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    questions: [],
  });
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [questionAdded, setQuestionAdded] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = (question: any) => {
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
    setQuestionAdded(true);
  };

  // Effect to show toast when question is added
  useEffect(() => {
    if (questionAdded) {
      toast.success("Question added successfully!");
      setQuestionAdded(false);
    }
  }, [questionAdded]);

  const removeQuestion = (index: number) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
      setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
    }
  };

  const nextStep = () => {
    // Validate before moving to next step
    if (
      step === 1 &&
      (!quizData.title.trim() || !quizData.description.trim())
    ) {
      toast.error("Please fill in both title and description");
      return;
    }
    if (step === 2 && quizData.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      await addQuiz(quizData).unwrap();
      //   toast.success("Quiz added successfully!", { duration: 2000 });
      if (quizData.questions.length > 0) {
        // toast.success("Questions added successfully!", { duration: 2000 });
        Swal.fire({
          title: "Drag me!",
          icon: "success",
          draggable: true,
          timer: 2000,
        });
      }
      // Reset state
      setQuizData({
        title: "",
        description: "",
        questions: [],
      });
      setStep(1);
      setOpen(false);
      // Close dialog after a short delay
    //   setTimeout(() => setOpen(false));
    } catch (error) {
      toast.error("Error adding quiz");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="my-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Add Quiz</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              {step === 1 && "Step 1: Enter Quiz Details"}
              {step === 2 && "Step 2: Add Questions"}
              {step === 3 && "Step 3: Review and Submit"}
            </DialogDescription>
          </DialogHeader>
          {step === 1 && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={quizData.title}
                  onChange={(e) => handleInputChange(e, "title")}
                  className="col-span-3"
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description *
                </Label>
                <Input
                  id="description"
                  value={quizData.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  className="col-span-3"
                  placeholder="Enter quiz description"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-4 py-4">
              {quizData.questions.map((q, index) => (
                <div key={index} className="border p-4 rounded-lg relative">
                  <Label className="text-right">
                    Q{index + 1}: {q.question}
                  </Label>
                  <Button
                    onClick={() => removeQuestion(index)}
                    variant="outline"
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => setOpenAddQuestionModal(true)}
                className="mt-4 w-full"
              >
                Add Another Question
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-4 py-4">
              <h3 className="font-semibold">Quiz Preview</h3>
              <div>
                <p>
                  <strong>Title:</strong> {quizData.title}
                </p>
                <p>
                  <strong>Description:</strong> {quizData.description}
                </p>
                <p>
                  <strong>Number of Questions:</strong>{" "}
                  {quizData.questions.length}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Questions:</h4>
                {quizData.questions.map((q, index) => (
                  <div key={index} className="mt-2 p-2 border rounded">
                    <p>
                      <strong>Q{index + 1}:</strong> {q.question}
                    </p>
                    <ul className="list-disc pl-5 mt-1">
                      {q.options.map((option, optIndex) => (
                        <li
                          key={optIndex}
                          className={
                            option === q.correctAnswer ? "font-semibold" : ""
                          }
                        >
                          {option}{" "}
                          {option === q.correctAnswer && "(Correct Answer)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            {step < 3 && <Button onClick={nextStep}>Next</Button>}
            {step === 3 && (
              <Button
                onClick={handleSubmit}
                className="bg-green-500"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <QuestionModal
        open={openAddQuestionModal}
        setOpen={setOpenAddQuestionModal}
        onAddQuestion={handleAddQuestion}
      />
    </div>
  );
}
