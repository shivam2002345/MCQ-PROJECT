const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { connectDBs } = require('./config/dbs');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');
const levelRoutes = require('./routes/levelRoutes');
const profileRoutes = require('./routes/profileRoutes');
const technologyRoutes = require('./routes/technologyRoutes');
const testDetailsRoutes = require('./routes/testDetailsRoutes');
const requestRoutes = require('./routes/requestRoutes');
const infoRoutes = require('./routes/infoRoutes');
const AdminRequestRoutes = require('./routes/AdminRequestRoutes');
const editUserRoutes = require('./routes/editUserRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionRoutes = require('./routes/questionRoutes');
const filterquestionRoutes = require('./routes/filterquestionRoutes');
const userRoutes = require('./routes/userRoutes');
const exams = require('./routes/exams');
const fetchHostedExam = require('./routes/fetchHostedExam');
const Admin = require('./routes/Admin');
const subtopicRoutes = require('./routes/subtopicRoutes');
const modifyPassword = require('./routes/modifyPassword');
const hostedresultRoutes = require('./routes/hostedresult');
const errorHandler = require('./middlewares/errorHandler');
const insertQuestionsRoutes = require('./routes/insertQuestionsRoutes');
const examStatus = require('./routes/examStatus');
const chatRoutes = require('./routes/chatRoutes');
const superAdminRequest = require('./routes/SuperAdminRequest');
const examCsvController = require('./controllers/examCsvController');
const logRoutes = require('./routes/routes');


// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(fileUpload()); // For handling file uploads if needed
app.use(express.urlencoded({ extended: true })); // For parsing form data if necessary

// Connect to the database
connectDBs();
app.use(express.json());  // Middleware to parse JSON bodies

// Routes
app.use(logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/testdetails', testDetailsRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api', infoRoutes);
app.use('/api/admin', AdminRequestRoutes); // Prefix for admin requests
app.use('/api', editUserRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/api', filterquestionRoutes);
app.use('/api', userRoutes);
app.use('/api', questionRoutes);
app.use('/api/customexams', exams);
app.use('/api/admin', adminRoutes);
app.use('/api', fetchHostedExam);
app.use('/api', Admin); // Admin-related routes
app.use('/api/subtopics', subtopicRoutes);
app.use('/api', modifyPassword);
app.use('/api/hostedresults', hostedresultRoutes);
app.use('/api/questions', insertQuestionsRoutes);
app.use('/api', examStatus);
app.use('/api/chat', chatRoutes);
app.use('/api/superadmin/requests', superAdminRequest);
app.use('/api/exam-csv', examCsvController); 

// Error handling middleware should be at the end
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
