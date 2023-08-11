require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK, CREATED, BadRequestError, NotFoundError, ConflictError } = require('../errors/errors');
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      return res.status(OK).send({ users });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден'));
      }
      return res.send({ user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('notValidId'))
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному id не найден'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        next(new NotFoundError('Пользователь c таким id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, name, about, avatar } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          res.status(CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          } else if (err.name === 'ValidationError' || err.name === 'CastError') {
            const errorMessage = Object.values(err.errors)
              .map((error) => error.message)
              .join(', ');
            next(new BadRequestError(`Переданы некорректные данные при создании пользователя: ${errorMessage}`));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

const editUserData = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля -- ${err.name}`));
      } else {
        next(err);
      }
    });
};

const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(`Переданы некорректные данные при обновлении профиля -- ${err.name}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserInfo,
  editUserData,
  editUserAvatar,
  createUser,
  login,
};
