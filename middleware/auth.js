const jwt = require('jsonwebtoken');
const User = require('../model/user'); 

const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).send({ error: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        const user = await User.findById(decoded._id);
        
        if (!user) {
            throw new Error('User not found');
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = {
    authenticateJWT,
    authorizeRoles
};
