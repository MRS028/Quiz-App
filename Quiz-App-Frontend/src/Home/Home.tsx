import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/Redux/hooks";
import { resetQuiz } from "@/Redux/features/quizSlices";
import AddQuiz from "./AddQuiz";
import AllQuiz from "./AllQuiz";
import { Rocket, Award, Clock, BarChart2, Sparkles } from "lucide-react";
import useScrollToTop from "@/hooks/useScrollToTop";
import { useRef } from "react";

// Fake data for stats (Unchanged)
const quizStats = [
  { icon: <Rocket size={28} />, value: "10,000+", label: "Quizzes Taken" },
  { icon: <Award size={28} />, value: "4.8/5", label: "Average Rating" },
  { icon: <Clock size={28} />, value: "95%", label: "Completion Rate" },
  { icon: <BarChart2 size={28} />, value: "50+", label: "Categories" },
];

export default function Home() {
  useScrollToTop();
   const allQuizRef = useRef<HTMLDivElement | null>(null);
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Logic is completely unchanged
  const handleStartQuiz = () => {
    // navigate("/quiz");
   allQuizRef.current.scrollIntoView({ behavior: "smooth" });
    dispatch(resetQuiz());
  };

  return (
    <main className="min-h-screen w-full flex-col items-center justify-start bg-slate-900 text-gray-200 px-4 py-16 md:py-24">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-4xl w-full text-center space-y-8 mb-20 md:mb-24">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-teal-900/50 border border-teal-500/30 rounded-full">
            <Sparkles className="w-5 h-5 text-teal-400 mr-2" />
            <span className="text-teal-300 font-medium">New Feature: Daily Challenges</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-50 leading-tight">
            Test Your Knowledge <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              With Fun Quizzes
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Challenge yourself with our interactive quizzes. Track your progress, earn badges, and climb the leaderboard!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto text-lg px-8 py-6 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Rocket className="mr-2" />
              Start A Random Quiz
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 bg-transparent border-2 border-slate-600 hover:border-teal-500 text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* This button styling works with your existing structure */}
              <div className="flex items-center justify-center">
                <Rocket className="mr-2" />
                <AddQuiz />
              </div>
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 md:mb-24 w-full max-w-5xl">
          {quizStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-teal-500/80 transition-all duration-300"
            >
              <div className="text-teal-400 mb-3">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-50">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="max-w-5xl w-full mb-20 md:mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-50 mb-12">
            Why Choose Our Quiz Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Instant Feedback</h3>
              <p className="text-gray-400">Get detailed explanations immediately after each question.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Track Progress</h3>
              <p className="text-gray-400">Monitor your improvement with detailed analytics.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">Diverse Topics</h3>
              <p className="text-gray-400">From science to pop culture, we've got you covered.</p>
            </div>
          </div>
        </section>

        {/* Quiz Management Section */}
        <section className="max-w-7xl w-full" ref={allQuizRef}>
          {/* The AllQuiz component will seamlessly fit into this design */}
          <AllQuiz />
        </section>
      </div>
    </main>
  );
}