const Card = require('../models/card');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(CREATED).send(data))
        .catch(() => {
          res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        });
    })
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send(card);
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK).send(card);
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK).send(card);
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
