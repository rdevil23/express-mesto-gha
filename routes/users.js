const router = require('express').Router();
const { getUsers, getUser, createUser, editUserData, editUserAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
