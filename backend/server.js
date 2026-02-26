const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send("Backend is running");
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));

app.listen(PORT, () => console.log("Server running on port " + PORT));