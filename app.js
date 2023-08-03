const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { NOT_FOUND } = require('./errors/errors');
require('dotenv').config();

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64c8251b5da78e53faf5dcba',
  };
  next();
});

app.use(router);

app.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to db');
  });

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
