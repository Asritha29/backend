const express = require('express');
const router = express.Router();

router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
