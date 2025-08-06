import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllQuizzesQuery } from "@/Redux/api/quizApi";
import { resetQuiz , setQuiz  , QuizData} from "@/Redux/features/quizSlices";
import { resetTimer } from "@/Redux/features/timerSlice";
import { useAppDispatch } from "@/Redux/hooks";
import { useNavigate } from "react-router-dom";

const AllQuiz = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: quizzes, isLoading, isError } = useGetAllQuizzesQuery(undefined);

  if (isLoading) {
    return <p className="text-center text-lg font-semibold">Loading quizzes...</p>;
  }

  if (isError || !quizzes) {
    return <p className="text-center text-red-500 font-semibold">Failed to load quizzes.</p>;
  }
   const handleStartQuiz = (id:any) => {
    console.log(id);
      navigate(`/quiz/${id}`);
      // dispatchEvent(resetQuiz());
      dispatch(resetTimer());
    };
    
    const handleSetQuiz = (question: QuizData[]) => {
      dispatch(setQuiz(question));

    }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Quizzes</h2>
        <Button variant="outline" >Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz: any) => (
          <>
          <Card key={quiz._id} className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total Questions: {quiz.questions?.length ?? 0}
              </p>
            </CardContent>
           
           <div className="text-center ">
            <Button onClick={()=>handleStartQuiz(quiz._id)} className="mt-4 w-24 ">Start Quiz</Button>
           </div>
          </Card>
           </>
        ))}
      </div>
    </div>
  );
};

export default AllQuiz;
