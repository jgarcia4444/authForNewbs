const express = require('express');
const router = express.Router();
const Joi = require('joi');

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().min(8).required()
});

router.get('/', (req, res) => {
    res.json({
        message: "This is the router in work"
    });
});

router.post('/signup', (req, res) => {
    const result = Joi.validate(req.body ,schema);
    res.json(result);
});

module.exports = router;