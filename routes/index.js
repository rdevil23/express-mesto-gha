const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validate');
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const { NotFoundError } = require('../errors/errors');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use('/users', auth, usersRoutes);
router.use('/cards', auth, cardsRoutes);

router.use('*', auth, () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
