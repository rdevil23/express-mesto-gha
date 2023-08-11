const router = require('express').Router();
const { getUsers, getUserInfo, getUser, editUserData, editUserAvatar } = require('../controllers/users');
const { validateUserId, validateEditUserData, validateEditUserAvatar } = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateEditUserData, editUserData);
router.patch('/me/avatar', validateEditUserAvatar, editUserAvatar);

module.exports = router;
