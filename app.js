const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const foodHandler = require('./controller/foodController');


mongoose.Promise = global.Promise; // ES6 Promie 사용하기
mongoose.connect('mongodb://localhost/food_data', { useMongoClient: true });
mongoose.connection
    .once('open', () => {})
    .on('error', (error) => console.warn('Warning', error));



const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/', foodHandler.create);

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname + '/list.html'));
})

app.get('/getList', foodHandler.list);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
