
# React Quiz App

A modern, interactive Quiz Application built with React, Redux Toolkit, and React Router.  
Features include per-quiz timer with progress bar, question navigation, answer tracking, and automatic submission when time expires.

---

## Demo

[[Live:](https://testquizapp28.netlify.app/)]

---

## Features

- Display quiz questions with multiple-choice options  
- Navigate between questions (Previous / Next)  
- Real-time answer tracking using Redux Toolkit  
- Timer for entire quiz duration based on number of questions  
- Visual countdown with progress bar  
- Automatic quiz submission when time runs out  
- SweetAlert2 confirmation on manual submission  
- Responsive and clean UI using Tailwind CSS  
- React Router for seamless page routing (Home, Quiz, Summary)  

---

## Technologies Used

- React (with Hooks)  
- Redux Toolkit  
- React Router DOM  
- TypeScript  
- Tailwind CSS  
- SweetAlert2 (for alerts)  

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)  
- npm or yarn  

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/react-quiz-app.git
cd react-quiz-app
````

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit:

```
http://localhost:3000
```

---

## Project Structure

```
src/
 ├─ components/       # Reusable UI components (Buttons, Cards, etc.)
 ├─ Home/
 │    ├─ Questions.tsx    # Quiz question component with timer and progress bar
 │    ├─ QuizSummary.tsx  # Summary page after quiz completion
 │    └─ quizData.ts      # Static quiz questions data
 ├─ Redux/
 │    ├─ features/
 │    │    └─ quizSlices.ts  # Redux slice for quiz state management
 │    └─ hooks.ts            # Typed hooks for Redux
 ├─ pages/
 │    └─ Home.tsx            # Landing/home page with Start Quiz button
 ├─ App.tsx                  # Router and main app entry
 └─ index.tsx                # React DOM render entry
```

---

## Usage

* Launch the app and land on the Home page
* Click **Start Quiz** to begin
* Timer and progress bar will start counting down
* Select answers and navigate through questions using **Next** and **Previous** buttons
* Submit quiz manually or wait for timer to auto-submit
* View your score and retake quiz if desired

---

## Customize

* Modify `quizData.ts` to add/edit quiz questions
* Adjust timer duration in `Questions.tsx` (`questions.length * 60` seconds per question by default)
* Style components using Tailwind CSS classes

---

## Future Improvements

* Add user authentication and save results online
* Include question categories and difficulty levels
* Support quiz pause and resume functionality
* Add animations and sound effects
* Make the app mobile-friendly with advanced responsive design



## Acknowledgements

* [React](https://reactjs.org/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [React Router](https://reactrouter.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [SweetAlert2](https://sweetalert2.github.io/)

---

Feel free to reach out for any questions or contributions!

```

---

```
