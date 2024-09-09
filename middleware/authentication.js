// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const auth = async (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded._id);
//         if (!user) {
//             throw new Error();
//         }
//         req.user = user;
//         next();
//     } catch (err) {
//         res.status(401).send({ error: 'Please authenticate.' });
//     }
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Authentication required.' });
    }

    try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
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

module.exports = auth;
