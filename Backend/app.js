const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Path to authRoutes
const examRoutes = require('./routes/examRoutes');  // Path to examRoutes
const resultRoutes = require('./routes/resultRoutes');
const levelRoutes = require('./routes/levelRoutes');
const cors = require('cors');
const technologyRoutes = require('./routes/technologyRoutes');// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Use the routes



app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);  
app.use('/api/levels', levelRoutes);
app.use('/api/technologies', technologyRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});