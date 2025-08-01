const Footer = () => {
  return (
    <footer className="mb-4 md:mt-4 border-t pt-4 text-center text-sm text-gray-500">
      <p>
        &copy; {new Date().getFullYear()} QuizApp. All rights reserved.
      </p>
      <p className="mt-1">
        Developed by <strong className="text-black font-semibold">Md. Rifat Sheikh</strong>
      </p>
    </footer>
  );
};

export default Footer;
