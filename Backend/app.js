const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  // Path to authRoutes
const examRoutes = require('./routes/examRoutes');  // Path to examRoutes
const resultRoutes = require('./routes/resultRoutes');
const levelRoutes = require('./routes/levelRoutes');
const cors = require('cors');

const profileRoutes = require('./routes/profileRoutes');
const technologyRoutes = require('./routes/technologyRoutes');// Load environment variables
const testDetailsRoutes = require('./routes/testDetailsRoutes');
const uploadCsv = require('./controllers/InsertQuestionController');
const fileUpload = require('express-fileupload');
const requestRoutes = require('./routes/requestRoutes'); // Import the request routes for User
const infoRoutes = require('./routes/infoRoutes');
const AdminRequestRoutes = require('./routes/AdminRequestRoutes'); // Import the request routes for Admin
const editUserRoutes = require('./routes/editUserRoutes');
const eventEmitter = require('./events/eventEmitter'); // Adjust the path as necessary
const notificationListener = require('./events/notificationListener'); // Adjust the path as necessary
const notificationRoutes = require('./routes/notificationRoutes'); // Adjust the path as necessary
const adminRoutes = require('./routes/adminRoutes');
const { connectDB } = require('./config/db');
const { connectDBs } = require('./config/dbs');
const questionRoutes = require('./routes/questionRoutes');
const filterquestionRoutes = require('./routes/filterquestionRoutes'); // Import question routes
const userRoutes = require('./routes/userRoutes'); // Import user routes


dotenv.config();

const app = express();
app.use(cors());
// Initialize the notification listener
notificationListener(); // Set up event handlers
connectDBs();
// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload()); // To handle file uploads
app.use(bodyParser.urlencoded({ extended: true }));
// Use the routes


// app.use('/api', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/results', resultRoutes);
app.use('/testdetails', testDetailsRoutes); 
app.use('/api/levels', levelRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/users', profileRoutes);
app.post('/api/upload-csv', uploadCsv);
app.use('/api/requests', requestRoutes);
app.use('/api', infoRoutes);
app.use('/api/admin', AdminRequestRoutes); // Prefix your routes
app.use('/api', editUserRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/admin', adminRoutes);
app.use('/api', filterquestionRoutes);
app.use('/api', userRoutes);
app.use('/api', questionRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});