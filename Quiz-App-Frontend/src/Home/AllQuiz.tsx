import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetAllQuizzesQuery,
  useStartQuizSessionMutation,
} from "@/Redux/api/quizApi";
import {
  setQuiz, // @ts-ignore
  type Tquiz, // @ts-ignore
  type QuizData,
} from "@/Redux/features/quizSlices";
import { useAppDispatch } from "@/Redux/hooks";
import { useNavigate } from "react-router-dom";
import { RotateCw, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <RotateCw className="w-8 h-8 text-teal-400 animate-spin" />
    <p className="text-center text-lg font-semibold text-gray-300">
      Loading Quizzes...
    </p>
  </div>
);

// Error Display
const ErrorDisplay = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-12 bg-red-900/20 border border-red-500/30 rounded-lg">
    <p className="text-center text-lg font-semibold text-red-400">
      Failed to load quizzes.
    </p>
    <p className="text-red-500">
      Please check your connection or try again later.
    </p>
  </div>
);

const AllQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
// @ts-ignore
  const [openForm, setOpenForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Tquiz | null>(null);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [startQuizSession] = useStartQuizSessionMutation();

  const {
    data: quizzes,
    isLoading,
    isError,
    refetch,
  } = useGetAllQuizzesQuery(undefined);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !quizzes) return <ErrorDisplay />;
  // @ts-ignore
  const handleSetQuiz = (question: QuizData[]) => {
    dispatch(setQuiz(question));
    navigate("/quiz");
  };

  const handleOpenForm = (quiz: Tquiz) => {
    setSelectedQuiz(quiz);
    setOpenForm(true);
  };

  const handleFormSubmit = async () => {
    if (!name || !className || !selectedQuiz) return;

    const res = await startQuizSession({
      name,
      class: className,
      quizId: selectedQuiz._id,
    }).unwrap();

    localStorage.setItem("quizSessionId", res.sessionId);
    dispatch(setQuiz(selectedQuiz.questions));
    setOpenForm(false);
    navigate("/quiz");
  };

  return (
    <div className=" max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-teal-400" />
          <h2 className="text-3xl font-bold text-gray-100">
            Choose Your Challenge
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="bg-slate-800/80 border-slate-600 hover:bg-slate-700 hover:text-teal-400 text-gray-300"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz: Tquiz) => (
          <Card
            key={quiz._id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden transition-all duration-300 group hover:border-teal-500/70 hover:shadow-2xl hover:shadow-teal-900/50 hover:-translate-y-2 flex flex-col"
          >
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-bold text-gray-100 group-hover:text-teal-400 transition-colors">
                {quiz.title}
              </CardTitle>
              <CardDescription className="text-gray-400 pt-2 h-16">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center text-teal-300/80 text-sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <p>Total Questions: {quiz.questions?.length ?? 0}</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenForm(quiz)}
                    className="w-full mt-6 bg-slate-700/80 hover:bg-teal-600 text-gray-200 hover:text-white font-semibold transition-all duration-300"
                  >
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px] w-[90vw] rounded-lg">
                  <DialogHeader className="px-4 pt-4">
                    <DialogTitle className="text-xl md:text-2xl">
                      Enter Your Details
                    </DialogTitle>
                    <DialogDescription className="text-sm md:text-base">
                      Please fill in your details to start the quiz.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm md:text-base">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-sm md:text-base p-2 md:p-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class" className="text-sm md:text-base">
                        Class
                      </Label>
                      <Input
                        id="class"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="w-full text-sm md:text-base p-2 md:p-3"
                      />
                    </div>
                    <Button
                      onClick={handleFormSubmit}
                      className="w-full mt-4 text-sm md:text-base py-2 md:py-3"
                    >
                      Start Quiz
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllQuiz;
