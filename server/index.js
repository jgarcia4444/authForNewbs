const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

const app = express();
// Make this require better
// const auth = require('./auth/index.js');
// const auth = require('./auth/index');
const auth = require('./auth');

app.use(volleyball);
app.use(cors({
    origin: 'http://localhost:8080',
    
}))
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.use('/auth', auth);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.Port || 3000;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})