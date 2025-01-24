const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
   

    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err)
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;