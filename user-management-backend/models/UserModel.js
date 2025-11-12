const mongoose = require('mongoose');

// Define the schema for the User
const userSchema = new mongoose.Schema({
    // Basic user information
    firstName: {
        type: String,
        required: [true, 'First name is required.'], // Mongoose validation: must be present
        trim: true, // Automatically removes whitespace from the start/end
        minlength: [2, 'First name must be at least 2 characters.'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true, // Ensures no two users share the same email
        lowercase: true, // Stores the email in lowercase
        trim: true,
        // Basic regex for email format validation
        match: [/.+@.+\..+/, 'Please enter a valid email address.'],
    },
    password: {
        // NOTE: In the next steps, we will hash this password for security.
        type: String,
        required: [true, 'Password is required.'],
        minlength: [8, 'Password must be at least 8 characters.'],
        select: false, // Ensures that the password field is excluded by default when querying users
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only allows these two values
        default: 'user',
    },
}, {
    // Adds `createdAt` and `updatedAt` timestamps automatically
    timestamps: true,
});

// Create and export the Mongoose model based on the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
