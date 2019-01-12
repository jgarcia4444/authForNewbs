const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db/connection');
const users = db.get('users');
// users.index('username'); Deprecated version
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required()
});

router.get('/', (req, res) => {
    res.json({
        message: "This is the router in work"
    });
});

router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body ,schema);
    if (result.error === null) {
        // make sure username is unique
        users.findOne({
            username: req.body.username
        }).then(user => {
            // if user is undefined username is not in the db
            if (user) {
                // There is already a user in the db with this username
                const error = new Error('This username already exists. Please choose another one.');
                res.status(409);
                next(error);
            } else {
                // hash the password
                // insert the user into the db
                bcrypt.hash(req.body.password.trim(), 12).then(hashedPassword => {
                    const newUser = {
                        username: req.body.username,
                        password: hashedPassword
                    };

                    users.insert(newUser).then(insertedUser => {
                        delete insertedUser.password;
                        res.json(insertedUser);
                    });

                });
            }
            // res.json({ user });
        });
    } else {
        res.status(422);
        next(result.error);
    }
    
});

function respondError422(res, next) {
    res.status(422);
    const error = new Error('Unable to login');
    next(error);
}

router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, schema);

    if (result.error === null) {
        users.findOne({
            username: req.body.username,
        }).then(user => {
            if (user) {
                // found the user in the db
                //now compare the password
                bcrypt.compare(req.body.password, user.password)
                .then((result) => {
                    if (result) {
                        // they sent us the right password
                        const payload = {
                            _id: user._id,
                            username: user.username,
                        };

                        jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: '1d'
                        },(err, token) => {
                            if (err) {
                                respondError422(res, next);
                            } else {
                                res.json({
                                    token
                                });
                            }
                        });

                    } else {
                        // They didn't send the right password
                        respondError422(res, next);
                    }
                })
            } else {
                // username does not exist
                // return error
                respondError422(res, next);
            }
        })
    } else {
        respondError422(res, next);
    }

    
})

module.exports = router;