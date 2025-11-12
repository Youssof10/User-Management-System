const userService = require('../services/userService');

// Utility for consistent response format
const SUCCESS = 'success';
const FAIL = 'fail';

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);

        // 201 Created status for successful registration
        res.status(201).json({
            status: SUCCESS,
            data: { user },
        });

    } catch (error) {
        console.error("Registration error:", error.message);
        // 400 Bad Request for validation errors
        res.status(400).json({
            status: FAIL,
            message: error.message,
        });
    }
};

/**
 * @desc Authenticate a user and get token
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                status: FAIL,
                message: 'Please enter both email and password.',
            });
        }

        const { user, token } = await userService.loginUser(email, password);

        // 200 OK status for successful login
        res.status(200).json({
            status: SUCCESS,
            data: { 
                user, 
                token 
            },
        });

    } catch (error) {
        console.error("Login error:", error.message);
        // 401 Unauthorized for invalid credentials
        res.status(401).json({
            status: FAIL,
            message: error.message,
        });
    }
};

/**
 * @desc Get authenticated user profile
 * @route GET /api/users/me
 * @access Private
 */
const getUserProfile = async (req, res) => {
    try {
        // req.user is set by the 'protect' middleware after token verification
        const user = await userService.getUserProfile(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: FAIL,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            status: SUCCESS,
            data: { user },
        });

    } catch (error) {
        console.error("Get Profile error:", error.message);
        res.status(500).json({
            status: FAIL,
            message: 'Server error.',
        });
    }
};

/**
 * @desc Update authenticated user profile
 * @route PATCH /api/users/me
 * @access Private
 */
const updateUserProfile = async (req, res) => {
    try {
        // ID is provided by the 'protect' middleware
        const userId = req.user.id; 
        const updateData = req.body;

        const updatedUser = await userService.updateUserProfile(userId, updateData);

        if (!updatedUser) {
            // Should not happen if middleware ensures user exists, but acts as a safeguard
            return res.status(404).json({
                status: FAIL,
                message: 'User not found or update failed.',
            });
        }

        res.status(200).json({
            status: SUCCESS,
            data: { user: updatedUser },
        });

    } catch (error) {
        console.error("Update Profile error:", error.message);
        // Handle common Mongoose/DB errors like unique constraint violation (code 11000)
        let status = 500;
        let message = 'Server error.';

        if (error.code === 11000) {
            status = 400; // Bad Request
            message = 'This email address is already in use.';
        } else if (error.name === 'ValidationError') {
            status = 400;
            message = error.message;
        }

        res.status(status).json({
            status: FAIL,
            message: message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        await userService.deleteUser(userId);

        res.status(200).json({
            status: SUCCESS,
            message: 'User account deleted successfully.',
        });
    } catch (error) {
        console.error("Delete User error:", error.message);
        res.status(500).json({
            status: FAIL,
            message: 'Server error.',
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    getUserProfile,
    updateUserProfile,
};
