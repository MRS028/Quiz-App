
# React Quiz App

A modern, interactive Quiz Application built with React, Redux Toolkit, and React Router.  
Features include a per-quiz timer with progress bar, question navigation, answer tracking, and automatic submission when time expires.

---

## 🚀 Live Demo

**👉 [Live: https://testquizapp28.netlify.app/](https://testquizapp28.netlify.app/)**

---

## ✨ Features

- Multiple-choice quiz questions  
- Navigate between questions (Previous / Next)  
- Real-time answer tracking using Redux Toolkit  
- Full quiz timer based on question count  
- Countdown timer with visual progress bar  
- Automatic submission when time runs out  
- SweetAlert2 confirmation for manual submission  
- Clean and responsive UI with Tailwind CSS  
- Seamless routing via React Router  

---

## ⚙️ Technologies Used

- React (with Hooks)  
- Redux Toolkit  
- React Router DOM  
- TypeScript  
- Tailwind CSS  
- SweetAlert2  

---

## 🛠 Getting Started

### Prerequisites

- Node.js (v14+ recommended)  
- npm or yarn  

### Installation

1. **Clone the repo:**

```bash
git clone https://github.com/yourusername/react-quiz-app.git
cd react-quiz-app
````

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Start the dev server:**

```bash
npm run dev
# or
yarn dev
```

4. **Open in browser:**

```
http://localhost:5000
```

---

## 📁 Project Structure

```
src/
 ├─ components/         # Reusable UI components (Timer, Controls)
 ├─ Home/
 │    ├─ Questions.tsx      # Core quiz interface
 │    ├─ QuizSummary.tsx    # Result/summary page
 │    └─ quizData.ts        # Static quiz questions
 ├─ Redux/
 │    ├─ features/
 │    │    └─ quizSlices.ts     # Quiz logic
 │    │    └─ timerSlice.ts     # Timer state (optional)
 │    └─ hooks.ts               # Typed Redux hooks
 ├─ pages/
 │    └─ Home.tsx               # Start page
 ├─ App.tsx                     # Routing setup
 └─ index.tsx                   # App entry point
```

---

## 🚀 Usage

1. Go to the home page and click **Start Quiz**
2. Timer and progress bar begin automatically
3. Choose answers and navigate between questions
4. Submit the quiz manually or let it auto-submit on timeout
5. View your score on the summary page

---

## 🧩 Customization

* Add/edit questions in `quizData.ts`
* Change timer duration in `Questions.tsx`
  (`questions.length * 60` seconds by default)
* Style UI using Tailwind CSS

---

## 🔮 Future Improvements

* User login and result history
* Question categories and difficulty
* Quiz pause/resume functionality
* Mobile-first design enhancements
* Audio/visual feedback and animations

---

## 🙌 Acknowledgements

* [React](https://reactjs.org/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [React Router](https://reactrouter.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [SweetAlert2](https://sweetalert2.github.io/)

---

