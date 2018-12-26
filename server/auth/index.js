const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: "This is the router in work"
    });
});

router.post('/signup', (req, res) => {

    console.log('body', req.body);

    res.json({
        message: 'signup post page'
    });
});

module.exports = router;