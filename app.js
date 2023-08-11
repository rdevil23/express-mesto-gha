require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(helmet());
app.use(limiter);
app.use(cookieParser);

app.use(errors());
app.use(errorHandler);

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
