const passport = require('passport');

function checkToken(req, res, next) {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error || !user) {
            return res.status(401).json({ message: 'Unauthorized', error: info ? info.message : 'Token tidak valid' });
        }
        req.user = user; // Add user data to the request
        next();
    })(req, res, next);
}

module.exports = checkToken;
