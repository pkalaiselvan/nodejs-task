var jwt = require('jsonwebtoken');
var users = require('../user/users');
var bcrypt = require('bcryptjs');

class auth_class {

    async get_token(data) {
        let user = await users.get_user({ Name: data['Name'] }, 'au_user');
        if (user) {
            let isMatch = await bcrypt.compare(data['Password'], user['Password'])
            .catch(err => { console.log(err); });
            if(isMatch){
                let token = jwt.sign({
                    data: {
                        id: user['_id']
                    }
                }, 'key', { expiresIn: 60 * 60 * 24 });
                return { status: 0, txt: 'Success', token: token }
            }
        } else {
            return { status: -1, txt: 'No User Found' }
        }
    }

    async verify_token(req){
        let token = req.token;
    }

    get_cookie(cookie,c_name) {
        var i, x, y, ARRcookies = cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }

}
let auth = new auth_class();

module.exports = auth;
