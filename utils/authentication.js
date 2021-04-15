var jwt = require('jsonwebtoken');
var users = require('../user/users');
var auth = require('./auth');

const authentication = (req, res, next) => {
    const token = req.headers.token || auth.get_cookie(req.headers.cookie, 'token');
    if (token) {
        jwt.verify(token, 'key', async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            let a_user = await users.get_user_by_id(user.data.id, 'au_user');
            delete a_user['Password'];
            req.user = a_user;
            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = authentication;