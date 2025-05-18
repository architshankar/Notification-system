require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { connectProducer } = require('./config/kafka');
const { startConsumer } = require('./consumers/notificationConsumer');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect to MongoDB
connectDB();

// Connect to Kafka
connectProducer();

// Start Kafka consumer
startConsumer();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Notification Service API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
