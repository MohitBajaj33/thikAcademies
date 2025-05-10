const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const attemptRoutes = require('./routes/attemptRoutes');
const resultRoutes = require('./routes/resultRoutes');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const emailRoutes = require('./routes/emailSendRoutes');
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get("/",(req,res)=>{
  res.send("Backend is working properly")
})
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attempt', attemptRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/email', emailRoutes);



const connectDB = require('./config/db');
connectDB();
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
