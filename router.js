var express = require('express');
var auth = require('./utils/auth');
var authentication = require('./utils/authentication');
var router = express.Router();
var users = require('./user/users');
var bcrypt = require('bcryptjs');

router.get('/', function (req, res, next) {
    return res.render('index.ejs');
});
router.post('/', async function (req, res) {
    const auth_cred = {
        Name: req.body.Name,
        Password: req.body.Password
    }
    var person = req.body;    
    if (!person.Name || !person.Password) {
        res.send();
    } else {
        let user = await users.get_user({ Name: person['Name'] }, 'au_user');
        if (user) {
            res.send({ status: -1, txt: 'User Already Present' });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(person['Password'], salt, async function (err, hash) {
                    person.Password = hash;
                    console.log('person',person)
                    let status = await users.insert_user(person, 'au_user')
                    console.log('status',status)
                    if(status.status == 0){
                        console.log('auth_cred',auth_cred)
                        let token = await auth.get_token(auth_cred);
                        console.log('token',token)
                        res.send(token);
                    } else {
                        res.send(status);
                    }
                    
                });
            });
        }
    }
});

router.get('/login', function (req, res, next) {
    return res.render('login.ejs');
});
router.post('/login', async function (req, res) {
    var person = req.body;
    if (!person.Name || !person.Password) {
        res.send();
    } else {
        let out = await auth.get_token(req.body)
        res.send(out);
    }
});

router.get('/user', async function (req, res) {
    let id = req.query.id;
    let user = {
        Name: '',
        Phone_Number: '',
        Address: '',
        State: '',
        City: ''
    }
    if (id) {
        user = await users.get_user_by_id(id, 'users');
    }
    return res.render('add_user.ejs', user);
});
router.post('/user', authentication, async function (req, res) {
    let id = req.query.id;
    var person = req.body;
    if (!person.Name || !person.Phone_Number || !person.Address || !person.State || !person.City) {
        res.send();
    } else {
        if (id) {
            person['author'] = req.user.Name;
            console.log(person)
            let status = await users.update_user(id, person, 'users');
            res.send(status);
        } else {
            let user = await users.get_user({ Name: person['Name'] }, 'users');
            console.log(id,user)
            if (user) {
                res.send({ status: -1, txt: 'User Already Present' });
            } else {
                person['author'] = req.user.Name;
                let status = await users.insert_user(person, 'users')
                res.send(status);
            }
        }
    }
});
router.delete('/user', authentication, async function (req, res) {
    let id = req.body.id;
    if (id) {
        let status = await users.delete_user(id, 'users');
        res.send(status);
    } else {
        res.send();
    }
});

router.get('/verify', authentication, async function (req, res) {
    console.log(req);
    res.send({ status: 0 });
});
router.get('/home', authentication, async function (req, res) {
    var data = await users.get_user_all({ author: req.user.Name }, 'users');
    console.log(data)
    return res.render('data.ejs', { data: data });
});

module.exports = router;