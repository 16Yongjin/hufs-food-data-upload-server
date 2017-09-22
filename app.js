const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({
    dest: 'public/uploads/',
    limits: { fileSize: 10000000, files: 1 }
});

const foodHandler = require('./controller/foodController');


mongoose.Promise = global.Promise; // ES6 Promie 사용하기
mongoose.connect('mongodb://localhost/food_data', { useMongoClient: true });
mongoose.connection
    .once('open', () => {})
    .on('error', (error) => console.warn('Warning', error));



const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', foodHandler.create);

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/list.html'));
});

app.post('/image', upload.single('image'), foodHandler.uploadImage);

app.get('/getList', foodHandler.list);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
