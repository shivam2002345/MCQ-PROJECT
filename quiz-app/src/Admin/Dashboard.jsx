import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [questionData, setQuestionData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total users count
                const userRes = await axios.get('http://localhost:8080/api/users');
                setUserCount(userRes.data.length); // Assuming the endpoint returns an array of users

                // Fetch question counts by technology
                const questionCountRes = await axios.get('http://localhost:8080/api/questions/count');
                if (Array.isArray(questionCountRes.data)) {
                    setQuestionData(questionCountRes.data);
                } else {
                    console.error('Expected an array of question counts, received:', questionCountRes.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare chart data for questions by technology
    const chartData = {
        labels: questionData.map(q => q.tech_name || 'Unknown'), // Technology names
        datasets: [{
            label: 'Questions Count',
            data: questionData.map(q => q.question_count || 0), // Question counts
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        }]
    };

    // Calculate percentage for the circular progress bar
    const totalUsersGoal = 1000; // Set your goal here
    const percentage = ((userCount / totalUsersGoal) * 100).toFixed(0);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Admin Dashboard</h1>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <div className="dashboard-cards">
                        <div className="dashboard-card total-users" style={{ width: '200px', height: '200px', margin: '0 auto' }}>
                            <h3>Total Users</h3>
                            {/* Display Circular Progress Bar */}
                            <CircularProgressbar
                                value={percentage}
                                text={`${userCount} Users`}
                                styles={buildStyles({
                                    textColor: '#000',
                                    pathColor: '#4CAF50',
                                    trailColor: '#d6d6d6',
                                })}
                            />
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3>Questions per Technology</h3>
                        {questionData.length === 0 ? (
                            <p>No question data available.</p>
                        ) : (
                            <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
                                <Bar 
                                    data={chartData} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false, // Allow custom sizing
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Number of Questions by Technology',
                                            },
                                        },
                                    }} 
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
