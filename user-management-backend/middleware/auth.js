const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

// IMPORTANT: Ensure this secret matches the one in your .env file and userService.js
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'; 

/**
 * Middleware function to protect routes: ensures the user is logged in and verifies the JWT.
 * If successful, it attaches the user data (excluding password) to req.user.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token and decode the payload
            const decoded = jwt.verify(token, JWT_SECRET);

            // 3. Find user by ID from the decoded payload, EXCLUDING the password hash
            // The result will be a Mongoose document containing non-sensitive user details.
            const user = await userRepository.findUserById(decoded.id);

            if (!user) {
                // User from token no longer exists in DB
                res.status(401).json({ 
                    status: 'fail', 
                    message: 'Not authorized, user no longer exists.' 
                });
                return;
            }

            // 4. Attach the non-sensitive user object to the request
            // The Controller can now access the verified user details via req.user
            req.user = user;

            // 5. Proceed to the next middleware or the Controller
            next();
            
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            res.status(401).json({ 
                status: 'fail', 
                message: 'Not authorized, token failed or expired.' 
            });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ 
            status: 'fail', 
            message: 'Not authorized, no token provided.' 
        });
        return;
    }
};

module.exports = { protect };
