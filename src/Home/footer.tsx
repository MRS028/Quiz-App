const Footer = () => {
  return (
    <footer className="mb-4 md:mt-10 border-t pt-4 text-center text-sm text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} QuizApp. All rights reserved.
      </p>
      <p className="mt-1">
        Developed by <a href="https://github.com/MRS028" target="_blank" rel="noopener noreferrer"><strong className="text-black font-semibold">Md. Rifat Sheikh</strong></a>
      </p>
    </footer>
  );
};

export default Footer;
