const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/categories', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Top Products Microservice is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});