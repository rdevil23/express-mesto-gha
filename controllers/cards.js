const Card = require('../models/card');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      return res.send(cards);
    })
    .catch(() => {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(CREATED).send(data))
        .catch(() => {
          return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
