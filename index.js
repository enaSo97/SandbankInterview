const express = require('express');
const app = express()
const port = 3000;
const users = require('./users');
const features = require('./features');

app.use(express.json());
app.use(express.urlencoded());

app.use('/user', users);
app.use('/features', features);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

