const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); 
require('dotenv').config();

const cors = require('cors');

// --- CORS Configuration ---
// This allows your frontend (http://localhost:4200) to communicate with the backend.
const corsOptions = {
    origin: 'http://localhost:4200', // Allow only your Angular frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies/authorization headers (JWTs)
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Apply CORS middleware with the specified options

const userRoutes = require('./routes/userRoutes'); // <-- Import the new routes

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware to parse JSON bodies in requests (Crucial for Postman POST requests)
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('✅ MongoDB Connected successfully.');
    })
    .catch(err => {
        console.error('❌ Error connecting to MongoDB', err);
        // Exit process if DB connection fails
        process.exit(1); 
    });

// --- API Route Mounting ---
// Mount the user routes under the base path '/api/users'
app.use('/api/users', userRoutes); 

// --- Health Check / Root Route ---
app.get('/', (req, res) => {
    // Check Mongoose connection status
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.status(200).json({ 
        message: 'User Management API is running.',
        db_status: dbStatus
    });
});

// --- 404 Route Handler (Catch-all) ---
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: `Cannot find ${req.originalUrl} on this server!` });
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
