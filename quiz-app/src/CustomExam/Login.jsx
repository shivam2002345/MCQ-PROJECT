import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Login.css'; // Importing the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [examId, setExamId] = useState("");
  const navigate = useNavigate();
  const { user_id } = useParams(); // Assume `user_id` is passed as a URL parameter.

  useEffect(() => {
    // Fetch user details by user_id from the database.
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${user_id}`);
        const data = await response.json();
        if (response.ok) {
          setEmail(data.email); // Populate email field.
        } else {
          alert("Error fetching user details: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user details.");
      }
    };
    fetchUserDetails();
  }, [user_id]);

  const handleLoginAndStartExam = async (e) => {
    e.preventDefault();
  
    if (!examId) {
      alert("Exam ID is required!");
      return;
    }
  
    try {
      // Update password API call with the correct body
      const updatePasswordResponse = await fetch(
        `http://localhost:8080/api/users/${user_id}/password`, // API endpoint
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password }), // Pass new password here
        }
      );
  
      const updatePasswordData = await updatePasswordResponse.json();
  
      if (updatePasswordResponse.ok) {
        // Store user_id in local storage
        localStorage.setItem("user_id", user_id); // Assuming `user_id` is available in scope
  
        // Optional: Provide feedback to the user
        console.log("Password updated successfully and user_id stored in localStorage.");
        
        // Redirect or navigate to the exam page
        navigate(`/exam/${examId}`);
      } else {
        alert(updatePasswordData.message || "Failed to update password.");
        console.error("Error updating password:", updatePasswordData);
      }
    } catch (error) {
      console.error("Error in handleLoginAndStartExam:", error);
    }
  };
  
//       const updatePasswordData = await updatePasswordResponse.json();

//       if (!updatePasswordResponse.ok) {
//         alert("Failed to update password: " + updatePasswordData.message);
//         return;
//       }

//       // Navigate to the exam page after a successful password update
//       navigate(`/exam/${examId}`);
//     } catch (error) {
//       console.error("Error updating password:", error);
//       alert("Failed to update password.");
//     }
//   };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLoginAndStartExam}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="form-input readonly-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Exam ID:</label>
            <input
              type="text"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">
            Login and Start Exam
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
