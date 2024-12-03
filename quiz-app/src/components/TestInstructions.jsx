import React from 'react';
import logo from '../assets/logo.png'; // Ensure this path points to your logo image
import './TestInstructions.css';
import UserNavbar from './Navbar';

const TestInstructions = () => {
    return (
      <>
      <UserNavbar/>
        <div className="instructions-container">
            <header className="header">
                <img src={logo} alt="CyberInfoMines Technology Logo" className="company-logo" />
                <h1 className="title">Test Instructions</h1>
            </header>
            <div className="content">
                <p className="intro">
                    Welcome to the CyberInfoMines Technology Test Portal. Please follow the instructions below carefully to ensure a smooth testing experience.
                </p>
                <ol className="instruction-list">
                    <li>Read the instructions thoroughly.</li>
                    <li>Register yourself if you haven’t done so already.</li>
                    <li>Log in to your account.</li>
                    <li>Click on "Start Test."</li>
                    <li>Select your desired technology and difficulty level.</li>
                    <li>Begin the test.</li>
                    <li>Keep an eye on the timer; you will have 30 minutes to complete 25 questions.</li>
                    <li>Submit your test once you have answered all questions.</li>
                    <li>Your score will be displayed in a pie chart format.</li>
                    <li>Click on "Review Exam" to see a detailed breakdown of your answers.</li>
                    <li>Return to the home page and click on "Dashboard."</li>
                    <li>In the dashboard, you can check your exam history and detailed analytics.</li>
                </ol>
                <div className="note">
                    <strong>Note:</strong> Each user will have only one attempt for the exam initially. After your first attempt, you will not be able to retake the exam. To request additional attempts, click on "Request Admin," provide your reason and the desired number of attempts, and submit your request. You will be notified once the admin has accepted or rejected your request. If accepted, you will be granted additional attempts.
                </div>
            </div>
            <footer className="footer">
                <p>Best regards,<br />Development Team,<br />CyberInfoMines Technology</p>
            </footer>
        </div>
        </>
    );
};

export default TestInstructions;
