import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full  bg-slate-900 border-t border-slate-700/50 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} QuizVerse. All rights reserved.
        </p>
        <a 
          href="https://github.com/MRS028" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors group"
        >
          <span className="group-hover:underline">Developed by Md. Rifat Sheikh</span>
          <Github className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
