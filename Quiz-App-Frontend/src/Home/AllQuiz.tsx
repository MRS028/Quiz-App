import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllQuizzesQuery } from "@/Redux/api/quizApi";

const AllQuiz = () => {
  const { data: quizzes, isLoading, isError } = useGetAllQuizzesQuery(undefined);

  if (isLoading) {
    return <p className="text-center text-lg font-semibold">Loading quizzes...</p>;
  }

  if (isError || !quizzes) {
    return <p className="text-center text-red-500 font-semibold">Failed to load quizzes.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Quizzes</h2>
        <Button>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz: any) => (
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllQuiz;
