const { JWT_USER_PASSWORD } = require("../config");
const jwt = require("jsonwebtoken");

const usermiddleware = (req, res, next) => {
    console.log('=== INCOMING REQUEST HEADERS ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // Check for token in Authorization header (Bearer token)
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Token found in Authorization header');
    } 
    // If not found in header, check the request body
    else if (req.body && req.body.token) {
        token = req.body.token;
        console.log('Token found in request body');
    }

    console.log('Extracted token:', token ? 'Token exists' : 'No token found');

    if (!token) {
        console.error('No token provided in request');
        return res.status(401).json({
            success: false,
            message: "Authentication required. No token provided.",
            receivedHeaders: req.headers
        });
    }

    try {
        console.log('Verifying token...');
        // Verify the token
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        console.log('Token verified successfully. User ID:', decoded.id);
        
        // Attach the user ID to the request object
        req.userId = decoded.id;
        
        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = {
    usermiddleware
};