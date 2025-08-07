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
import { Plus, Trash2, ArrowLeft, ArrowRight, Check, Send,  } from "lucide-react";

// --- THEMED MODAL CONFIG ---
const themedSwal = Swal.mixin({
  background: '#1e293b', // slate-800
  color: '#e2e8f0', // slate-200
  customClass: {
    popup: 'border border-slate-700 rounded-xl',
    confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mx-2',
    cancelButton: 'bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg mx-2',
    title: 'text-gray-100',
  },
  buttonsStyling: false,
  showCancelButton: true,
  confirmButtonText: 'Yes, remove it!',
  cancelButtonText: 'No, cancel!',
  reverseButtons: true
});

// --- TYPE DEFINITIONS ---
type QuizData = {
  title: string;
  description:string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
};

type Question = QuizData['questions'][0];

// --- STEPPER COMPONENT ---
const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
  <div className="flex items-center justify-center w-full mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep > index + 1 ? 'bg-emerald-500' : currentStep === index + 1 ? 'bg-teal-500 scale-110' : 'bg-slate-700'
            }`}
          >
            {currentStep > index + 1 ? <Check className="w-6 h-6 text-white" /> : <span className="font-bold text-white">{index + 1}</span>}
          </div>
          <p className={`mt-2 text-xs font-semibold ${currentStep >= index + 1 ? 'text-gray-200' : 'text-gray-500'}`}>{step}</p>
        </div>
        {index < steps.length - 1 && (
          <div className={`flex-auto border-t-2 transition-all duration-300 mx-4 ${currentStep > index + 1 ? 'border-emerald-500' : 'border-slate-700'}`}></div>
        )}
      </div>
    ))}
  </div>
);


// --- QUESTION MODAL COMPONENT ---
function QuestionModal({
  open,
  setOpen,
  onAddQuestion,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddQuestion: (question: Question) => void;
}) {
  const [addQuestionStep, setAddQuestionStep] = useState(1);
  const [newQuestion, setNewQuestion] = useState<Question>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  // Logic remains the same
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, optionIndex?: number) => {
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
    setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    setOpen(false);
    setAddQuestionStep(1);
  };

  const canProceedToNextStep = () => {
    if (addQuestionStep === 1) return newQuestion.question.trim() !== "";
    if (addQuestionStep === 2) return newQuestion.options.every((option) => option.trim() !== "");
    return true;
  };

  const canAddQuestion = () => newQuestion.correctAnswer !== "" && newQuestion.options.includes(newQuestion.correctAnswer);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-100">Add New Question</DialogTitle>
          <DialogDescription className="text-gray-400">
            Follow the steps to construct your question.
          </DialogDescription>
        </DialogHeader>
        <Stepper currentStep={addQuestionStep} steps={['Question', 'Options', 'Answer']} />
        
        <div className="min-h-[200px] flex flex-col justify-center">
            {addQuestionStep === 1 && (
                <Input placeholder="e.g., What is the capital of France?" value={newQuestion.question} onChange={(e) => handleInputChange(e, "question")} className="bg-slate-800 border-slate-600 focus:border-teal-500" />
            )}
            {addQuestionStep === 2 && (
                <div className="grid grid-cols-2 gap-4">
                    {newQuestion.options.map((option, i) => (
                        <Input key={i} placeholder={`Option ${i + 1}`} value={option} onChange={(e) => handleInputChange(e, "option", i)} className="bg-slate-800 border-slate-600 focus:border-teal-500" />
                    ))}
                </div>
            )}
            {addQuestionStep === 3 && (
                <div className="space-y-2">
                    <Label>Select the correct answer</Label>
                    <select value={newQuestion.correctAnswer} onChange={(e) => handleCorrectAnswerSelect(e.target.value)} className="w-full p-2 mt-2 border rounded-md bg-slate-800 border-slate-600 text-gray-200 focus:border-teal-500 focus:ring-teal-500">
                        <option value="" disabled>-- Select an answer --</option>
                        {newQuestion.options.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>

        <DialogFooter className="mt-6">
          {addQuestionStep > 1 && <Button variant="outline" onClick={() => setAddQuestionStep(s => s - 1)} className="border-slate-600 hover:bg-slate-700 text-black"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>}
          {addQuestionStep < 3 ? (
            <Button onClick={() => setAddQuestionStep(s => s + 1)} disabled={!canProceedToNextStep()} className="bg-teal-600 hover:bg-teal-700">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button onClick={addQuestion} disabled={!canAddQuestion()} className="bg-emerald-600 hover:bg-emerald-700">Add Question <Check className="w-4 h-4 ml-2" /></Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- MAIN ADD QUIZ COMPONENT ---
export default function AddQuiz() {
  const [addQuiz, { isLoading }] = useAddQuizMutation();
  const [step, setStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({ title: "", description: "", questions: [] });
  const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [questionAdded, setQuestionAdded] = useState(false);

  // Logic remains the same
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setQuizData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddQuestion = (question: Question) => {
    setQuizData(prev => ({ ...prev, questions: [...prev.questions, question] }));
    setQuestionAdded(true);
  };

  useEffect(() => {
    if (questionAdded) {
      toast.success("Question added successfully!");
      setQuestionAdded(false);
    }
  }, [questionAdded]);

  const removeQuestion = (index: number) => {
    themedSwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
        setQuizData(prev => ({ ...prev, questions: updatedQuestions }));
        toast.info("Question removed.");
      }
    });
  };

  const nextStep = () => {
    if (step === 1 && (!quizData.title.trim() || !quizData.description.trim())) {
      toast.error("Please fill in both title and description");
      return;
    }
    if (step === 2 && quizData.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      await addQuiz(quizData).unwrap();
      toast.success("Quiz created successfully!");
      setQuizData({ title: "", description: "", questions: [] });
      setStep(1);
      setOpen(false);
    } catch (error) {
      toast.error("Error creating quiz. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent border-2 border-slate-600 hover:border-teal-500 text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1">
            <Plus className="mr-2" /> Create a Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-100">Create New Quiz</DialogTitle>
          </DialogHeader>
          <Stepper currentStep={step} steps={['Details', 'Questions', 'Review']} />
          
          <div className="min-h-[350px]">
            {step === 1 && (
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input id="title" value={quizData.title} onChange={(e) => handleInputChange(e, "title")} className="bg-slate-800 border-slate-600 focus:border-teal-500" placeholder="e.g., JavaScript Fundamentals" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Quiz Description *</Label>
                  <Input id="description" value={quizData.description} onChange={(e) => handleInputChange(e, "description")} className="bg-slate-800 border-slate-600 focus:border-teal-500" placeholder="e.g., Test your core JS knowledge." />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 py-4">
                <div className="max-h-[250px] space-y-3 pr-2 overflow-y-auto">
                  {quizData.questions.length > 0 ? quizData.questions.map((q, index) => (
                    <div key={index} className="border border-slate-700 p-3 rounded-lg flex items-center justify-between bg-slate-800/50">
                      <p className="font-medium truncate pr-4">Q{index + 1}: {q.question}</p>
                      <Button onClick={() => removeQuestion(index)} variant="ghost" size="icon" className="text-red-400 hover:bg-red-900/50 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  )) : <p className="text-center text-gray-400">No questions added yet.</p>}
                </div>
                <Button onClick={() => setOpenAddQuestionModal(true)} className="mt-4 w-full bg-teal-600 hover:bg-teal-700"><Plus className="w-4 h-4 mr-2" /> Add a Question</Button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 py-4 max-h-[350px] overflow-y-auto pr-2">
                <h3 className="font-semibold text-xl text-gray-100 border-b border-slate-700 pb-2">Quiz Preview</h3>
                <div className="space-y-2">
                  <p><strong className="text-teal-400">Title:</strong> {quizData.title}</p>
                  <p><strong className="text-teal-400">Description:</strong> {quizData.description}</p>
                  <p><strong className="text-teal-400">Questions:</strong> {quizData.questions.length}</p>
                </div>
                <div className="mt-4 space-y-3">
                  {quizData.questions.map((q, index) => (
                    <div key={index} className="p-3 border border-slate-700 rounded-lg bg-slate-800/50">
                      <p><strong>Q{index + 1}:</strong> {q.question}</p>
                      <ul className="list-disc pl-5 mt-1 text-gray-400">
                        {q.options.map((opt, optIndex) => (
                          <li key={optIndex} className={opt === q.correctAnswer ? "font-semibold text-emerald-400" : ""}>
                            {opt} {opt === q.correctAnswer && <Check className="inline w-4 h-4 ml-1" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            {step > 1 && <Button variant="outline" onClick={prevStep} className="border-slate-600 text-black hover:bg-slate-700"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>}
            {step < 3 && <Button onClick={nextStep} className="bg-teal-600 hover:bg-teal-700">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>}
            {step === 3 && <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>{isLoading ? "Submitting..." : <><Send className="w-4 h-4 mr-2" /> Submit Quiz</>}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <QuestionModal open={openAddQuestionModal} setOpen={setOpenAddQuestionModal} onAddQuestion={handleAddQuestion} />
    </>
  );
}
