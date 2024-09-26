import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import TestSetupPage from './components/TestSetupPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ReviewPage from './components/ReviewPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test-setup" element={<TestSetupPage />} />
        <Route path="/quiz/:exam_id" element={<QuizPage />} /> {/* Updated to accept exam_id */}
        <Route path="/result" element={<ResultPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
