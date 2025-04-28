const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/connect');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // MongoDB connection

app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
