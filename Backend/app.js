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

dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Use the routes



app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/results', resultRoutes);
app.use('/testdetails', testDetailsRoutes); 
app.use('/api/levels', levelRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/users', profileRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});