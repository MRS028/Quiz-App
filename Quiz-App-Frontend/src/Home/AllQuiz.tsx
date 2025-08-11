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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ✅ FIXED IMPORT

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
  const [selectedQuiz, setSelectedQuiz] = useState<Tquiz | null>(null);
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [startQuizSession] = useStartQuizSessionMutation();

  const { data: quizzes, isLoading, isError, refetch } =
    useGetAllQuizzesQuery(undefined);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !quizzes) return <ErrorDisplay />;

  const handleOpenForm = (quiz: Tquiz) => {
    setSelectedQuiz(quiz);
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
    navigate("/quiz");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 mt-2 text-teal-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
            Choose One
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
              <div className="flex items-center text-teal-300/80 text-sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                <p>Total Questions: {quiz.questions?.length ?? 0}</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => handleOpenForm(quiz)}
                    className="w-full mt-6 bg-slate-700/80 hover:bg-teal-600 text-gray-200 hover:text-white font-semibold transition-all duration-300 text-sm sm:text-base py-3 sm:py-4"
                  >
                    Start Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px] rounded-lg">
                  <DialogHeader className="px-4 pt-4 sm:pt-6">
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                      Enter Your Details
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm md:text-base lg:text-lg">
                      Please fill in your details to start the quiz.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Name */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="name"
                        className="text-xs sm:text-sm md:text-base lg:text-lg font-medium"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-sm sm:text-base md:text-lg px-3 py-2 sm:py-3 md:py-4"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="class"
                        className="text-xs sm:text-sm md:text-base lg:text-lg font-medium"
                      >
                        Class
                      </Label>
                      <Select
                        onValueChange={(value) => setClassName(value)}
                        value={className}
                      >
                        <SelectTrigger
                          id="class"
                          className="w-full text-sm sm:text-base md:text-lg px-3 py-2 sm:py-3 md:py-4"
                        >
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit */}
                    <Button
                      onClick={handleFormSubmit}
                      className="w-full mt-4 sm:mt-6 text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-5"
                    >
                      Start Quiz Now
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
