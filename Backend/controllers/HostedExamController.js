// controllers/examsController.js
const HostedExam = require('../models/HostedExam');
const { UUIDV4 } = require('sequelize'); // Ensure this is imported if needed
const fs = require("fs");
const csvParser = require("csv-parser");
const nodemailer = require("nodemailer");
require('dotenv').config();
const Notification = require('../models/Notification'); // Import the Notification model
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { findUserByEmail, createUser } = require('../models/userModel'); // Import functions from userModel

async function createExam(req, res) {
  try {
    const { user_id, technology, num_questions, duration, questions, admin_id } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Questions should be an array" });
    }

    if (!admin_id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Step 1: Create the exam with 'status' set to 'false'
    const newExam = await HostedExam.create({
      user_id,
      technology,
      num_questions,
      duration,
      questions,
      admin_id,                // Include the admin_id field here
      status: false,           // Add status with the default value 'false'
      created_at: new Date(),
      updated_at: new Date()
    });

    // Generate exam code (you can use `exam_id` or generate a new code)
    const examCode = newExam.exam_id; // Or create a custom code if needed

    // Step 2: Create a notification for the user
    const notificationMessage = `Your custom exam on ${technology} has been created successfully! Use the exam code ${examCode} to take the exam.`;

    const newNotification = await Notification.create({
      user_id,                   // Reference to the user
      message: notificationMessage,
      status: 'unread',          // Default status can be 'unread'
      hosted_exam_id: newExam.exam_id, // Reference to the created exam
      created_at: new Date(),
    });

    // Step 3: Return success response
    res.status(201).json({
      message: 'Exam created successfully',
      exam: newExam,
      notification: newNotification // Send the created notification as part of the response
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
}


async function getExamById(req, res) {
  try {
    const { exam_id } = req.params;  // Get the exam_id from the request params

    // Fetch the exam from the database
    const exam = await HostedExam.findOne({
      where: { exam_id },
    });

    // If the exam is not found
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if the exam has already been taken (status = true)
    if (exam.status === true) {
      return res.status(400).json({ message: 'Sorry, you have already given this exam!' });
    }

    // If exam is not taken, return the exam details
    res.status(200).json({
      message: 'Exam fetched successfully',
      exam,
    });
  } catch (error) {
    console.error("Error in getExamById:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


async function checkAnswers(req, res) {
  try {
    const { exam_id, answers } = req.body;

    // Fetch the exam data using exam_id instead of id
    const exam = await HostedExam.findOne({ where: { exam_id } });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const { questions } = exam;
    const results = [];

    answers.forEach((answer) => {
      const question = questions.find(q => q.question_id === answer.question_id);
      if (question) {
        const isCorrect = question.correct_option === answer.selected_option;
        results.push({
          question_id: answer.question_id,
          isCorrect,
          correct_option: question.correct_option,
        });
      }
    });

    res.status(200).json({
      message: 'Answers checked successfully',
      results,
    });
  } catch (error) {
    console.error('Error in checkAnswers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


// Function to create an exam for a new user and send email invite

// Create exam for new user
// API to create an exam for a new user
async function createExamForNewUser(req, res) {
  const { email, technology, num_questions, duration, admin_id, name } = req.body;
  let { questions } = req.body;

  try {
    // Check for missing required fields
    if (!email || !technology || !num_questions || !duration || !admin_id || !name) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate number of questions
    if (num_questions > 25) {
      return res.status(400).json({ message: "Number of questions cannot exceed 25." });
    }

    console.log("Starting to parse CSV file, if any...");
    // Parse CSV file if uploaded
    if (req.file) {
      try {
        questions = await parseCsvQuestions(req.file.path);
        console.log("CSV Parsing successful, questions:", questions);
      } catch (err) {
        console.error("Error parsing CSV file:", err);
        return res.status(400).json({ message: "Error parsing CSV file. Please upload a valid file." });
      }
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions must be a non-empty array." });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    let userId;

    if (!existingUser) {
      console.log("User does not exist. Creating new user...");
      const temporaryPassword = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

      // Create new user using createUser function
      const newUser = await createUser(name, email, hashedPassword);
      userId = newUser.user_id;

      // Send temporary password and invite email
      const examLink = `http://localhost:5173/newuser/${userId}`;
      const newExam = await HostedExam.create({
        user_id: userId,
        technology,
        num_questions,
        duration,
        questions,
        exam_link: examLink,
        admin_id,
        status: false, // Default status set to false
      });

      // Get exam_id from newExam and send invite
      const examId = newExam.exam_id;
      await sendEmailInvite(email, technology, duration, temporaryPassword, examLink, examId);

      console.log("New exam created and email sent for new user.");
    } else {
      console.log("User already exists. Creating exam...");
      userId = existingUser.user_id;

      // If user already exists, create exam
      const examLink = `http://localhost:5173/newuser/${userId}`;
      const newExam = await HostedExam.create({
        user_id: userId,
        technology,
        num_questions,
        duration,
        questions,
        exam_link: examLink,
        admin_id,
        status: false, // Default status set to false
      });
      // Get exam_id from newExam and send invite
      const examId = newExam.exam_id;
      await sendEmailInvite(email, technology, duration, null, examLink, examId);

      console.log("Exam created and email sent for existing user.");
    }

    res.status(201).json({
      message: "Exam created successfully, user added (if new), and invite sent.",
    });
  } catch (error) {
    console.error("Unexpected error in createExamForNewUser:", error);

    // Check for specific errors
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Validation error: " + error.errors.map(e => e.message).join(", ") });
    }

    // General server error
    res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
  }
}

// Function to parse questions from a CSV file
async function parseCsvQuestions(filePath) {
  const questions = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Validate each row for required fields
        if (
          row.question_id &&
          row.question_text &&
          row.option_a &&
          row.option_b &&
          row.option_c &&
          row.option_d &&
          row.correct_option
        ) {
          questions.push(row);
        } else {
          console.warn("Skipping invalid row:", row);
        }
      })
      .on("end", () => {
        fs.unlinkSync(filePath); // Delete the file after parsing
        console.log("CSV file deleted:", filePath);
        resolve(questions);
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        reject(error);
      });
  });
}



// Function to send an email invitation
async function sendEmailInvite(email, technology, duration, temporaryPassword, examLink, examId) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Cyberinfomines MCQ" <no-reply@cyberinfomines.com>',
      to: email,
      subject: `Exam Invitation for ${technology}`,
      text: `
    Hi,

    You have been invited to take a ${technology} exam of duration ${duration} minutes.
    Create a new password for you Cyberinfomines Mcq Test App by clicking in this link"

    Exam ID: ${examId ? examId : "Not Available"}
    Exam Link: ${examLink}

    Click on the link to register and start your exam.

    Best of luck!
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", email);
  } catch (error) {
    console.error("Error in sendEmailInvite:", error.message);
    throw new Error("Failed to send email invite");
  }
}

module.exports = {
  createExam,
  getExamById,
  checkAnswers,
  createExamForNewUser,
};
