const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

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

module.exports = router;