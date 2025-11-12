const express = require('express');
// Create an Express Router instance to handle paths
const router = express.Router(); 

// Import the Controller which contains the logic functions
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/auth');

/**
 * Route definition for user registration.
 * HTTP Method: POST
 * Path: /register
 * Handler: userController.registerUser
 */
router.route('/register').post(userController.registerUser);

router.route('/login').post(userController.loginUser);

// Route to get the currently authenticated user's profile
// We apply the authMiddleware.protect function BEFORE the userController.getUserProfile
router.route('/me')
.get(authMiddleware.protect, userController.getUserProfile)
.patch(authMiddleware.protect, userController.updateUserProfile)
.delete(authMiddleware.protect, userController.deleteUser);

// Export the router so index.js can use it
module.exports = router;
