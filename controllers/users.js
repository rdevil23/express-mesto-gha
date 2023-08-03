const User = require('../models/user');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK).send({ data: users });
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким id не найден' });
        return;
      }
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(', ')}`,
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const editUserData = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(', ')}`,
        });
        return;
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const editUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  editUserData,
  editUserAvatar,
};
