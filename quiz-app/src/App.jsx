import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import TestSetupPage from './components/TestSetupPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
// import ReviewPage from './components/ReviewPage';
import ProfilePage from './components/ProfilePage'; // Import the new Dashboard component
import { getUserAuthStatus } from './utils/auth'; // Import a utility function to check login status

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch user login status on component mount
    const status = getUserAuthStatus(); // Now using the token check
    setIsLoggedIn(status);
  }, []);


  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/test-setup" element={<TestSetupPage />} />
        <Route path="/quiz/:exam_id" element={<QuizPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/results/:exam_id/:user_id" element={<ResultPage />} />
        {/* Dashboard route, only accessible when logged in */}
        <Route path="/dashboard" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
