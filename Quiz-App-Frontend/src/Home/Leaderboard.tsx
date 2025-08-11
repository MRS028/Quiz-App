import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, BrainCircuit,  Users } from "lucide-react";
import { useGetQuizResultsQuery, } from "@/Redux/api/quizApi";

export default function Leaderboard() {
  const { data, isLoading, error } = useGetQuizResultsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] bg-gray-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
        <span className="mt-4 text-lg text-gray-400 tracking-wider">
          Loading Leaderboard...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-900">
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-6 rounded-lg max-w-md text-center">
          <p className="font-semibold text-xl">❌ An Error Occurred</p>
          <p className="mt-2 text-red-400/80">
            Something went wrong while fetching the leaderboard data. Please try
            again later.
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20 p-4">
        <Trophy className="mx-auto h-12 w-12 text-gray-600" />
        <h2 className="mt-4 text-2xl font-semibold text-white">
          No Data Available
        </h2>
        <p className="mt-2">
          There is currently no leaderboard data to display.
        </p>
      </div>
    );
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return (
        <Badge className="bg-amber-400 text-amber-900 font-bold shadow-lg shadow-amber-400/30">
          🥇 #{rank}
        </Badge>
      );
    if (rank === 2)
      return (
        <Badge className="bg-slate-300 text-slate-900 font-bold shadow-lg shadow-slate-300/30">
          🥈 #{rank}
        </Badge>
      );
    if (rank === 3)
      return (
        <Badge className="bg-orange-400 text-orange-900 font-bold shadow-lg shadow-orange-400/30">
          🥉 #{rank}
        </Badge>
      );
    return (
      <Badge variant="outline" className="border-slate-600 text-slate-300">
        #{rank}
      </Badge>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-slate-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-500">
            🏆 Global Quiz Leaderboard
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            See who's topping the charts in each quiz!
          </p>
        </header>

        {data.map((quiz) => (
          <Card
            key={quiz._id.quizId}
            className="border-2 border-slate-800 bg-slate-800/40 backdrop-blur-sm shadow-2xl shadow-black/30 rounded-2xl overflow-hidden"
          >
            <CardHeader className="p-6 border-b border-slate-700/50">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-8 h-8 text-teal-400" />
                  <span className="text-xl md:text-2xl font-bold text-slate-100">
                    {quiz.quizTitle}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-teal-400/10 mx-10 text-teal-300 border border-teal-400/20 px-3 py-1 text-sm"
                >
                  Class: {quiz._id.class}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 flex items-center justify-center gap-2">
                    <Users size={16} />
                    Total Students
                  </h3>
                  <p className="text-2xl font-semibold text-white mt-1">
                    {quiz.totalStudents}
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400">
                    Total Marks
                  </h3>
                  <p className="text-2xl font-semibold text-cyan-400 mt-1">
                    {quiz?.totalQuestions}
                  </p>
                </div>
                
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400">
                    Highest Score
                  </h3>
                  <p className="text-2xl font-semibold text-green-400 mt-1">
                    {quiz.highestPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400">
                    Average Score
                  </h3>
                  <p className="text-2xl font-semibold text-cyan-400 mt-1">
                    {quiz.averagePercentage.toFixed(1)}%
                  </p>
                </div>
                {/* <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400">
                    Lowest Score
                  </h3>
                  <p className="text-2xl font-semibold text-red-400 mt-1">
                    {quiz.lowestPercentage.toFixed(1)}%
                  </p>
                </div> */}
              </div>

              {quiz.students?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-slate-700 hover:bg-transparent">
                        <TableHead className="w-[100px] text-center text-slate-400 uppercase tracking-wider">
                          Rank
                        </TableHead>
                        <TableHead className="text-slate-400 uppercase tracking-wider">
                          Name
                        </TableHead>
                        <TableHead className="text-center text-slate-400 uppercase tracking-wider">
                          Marks
                        </TableHead>
                        <TableHead className="text-center text-slate-400 uppercase tracking-wider">
                          Percentage
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quiz.students.map((student, index) => (
                        <TableRow
                          key={student._id}
                          className="border-b-slate-800 hover:bg-slate-700/50 transition-colors"
                        >
                          <TableCell className="text-center font-medium text-lg">
                            {getRankBadge(index + 1)}
                          </TableCell>
                          <TableCell className="font-medium text-slate-200">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-center text-slate-300">
                            {student.marks}
                          </TableCell>
                          <TableCell className="text-center font-semibold text-teal-300">
                            {student.percentage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    No student performance data available for this quiz.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
