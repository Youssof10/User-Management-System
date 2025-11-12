const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'; 
const JWT_EXPIRATION = '1h'; 

/**
 * Registers a new user.
 * @param {object} userData - User data (firstName, lastName, email, password).
 * @returns {Promise<object>} The created user object (without password).
 */
const registerUser = async (userData) => {
    // 1. Check for existing user
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('User already exists with that email address.');
    }

    // 2. Hash Password (Service Layer responsibility)
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // 3. Create User via Repository
    const user = await userRepository.createUser(userData);

    // 4. Clean and return user data (explicitly remove password)
    const userResponse = user.toObject();
    delete userResponse.password; 
    return userResponse;
};

/**
 * Logs in a user, authenticates credentials, and generates a JWT.
 * @param {string} email - User email.
 * @param {string} rawPassword - User's raw, unhashed password.
 * @returns {Promise<{user: object, token: string}>} User object and JWT.
 */
const loginUser = async (email, rawPassword) => {
    // 1. Fetch the user from the repository, INCLUDING the hashed password
    // We pass 'true' to ensure the password field is returned.
    const user = await userRepository.findUserByEmail(email, true); 

    // 2. Check if user exists (generic error for security)
    if (!user) {
        throw new Error('Invalid credentials.');
    }

    // 3. Compare the provided raw password with the hashed password from the database
    const isMatch = await bcrypt.compare(rawPassword, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials.');
    }

    // 4. Authentication successful! Generate JWT token.
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );

    // 5. Return the user data (excluding password) and the token
    const userResponse = user.toObject();
    delete userResponse.password; 

    return {
        user: userResponse,
        token: token
    };
};

/**
 * Retrieves a user's profile data.
 * @param {string} userId - ID of the authenticated user.
 * @returns {Promise<object|null>} The user object (without password).
 */
const getUserProfile = async (userId) => {
    // The middleware already verified the ID, so we just fetch the data.
    return await userRepository.findUserById(userId);
};

/**
 * Updates an authenticated user's profile data.
 * @param {string} userId - ID of the authenticated user.
 * @param {object} updateData - Data fields to update.
 * @returns {Promise<object|null>} The updated user object (without password).
 */
const updateUserProfile = async (userId, updateData) => {
    // Note: The Mongoose validator handles unique email checking.
    // If the user attempts to change their password, the Service should handle hashing here.
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    // Call repository to perform the update
    return await userRepository.updateUser(userId, updateData);


};

const deleteUser = async (userId) => {
    return await userRepository.deleteUser(userId);
};

module.exports = { 
    registerUser,
    loginUser,
    getUserProfile,
    deleteUser,
    updateUserProfile
};
