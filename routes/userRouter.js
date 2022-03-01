const express = require('express');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', userCtrl.register);

router.post('/login', userCtrl.login);

router.get('/logout', userCtrl.logout);

router.get('/info', auth, userCtrl.getUser);

router.get('/refresh_token', userCtrl.refreshToken);

router.patch('/addcart', auth, userCtrl.addCart);

router.get('/history', auth, userCtrl.history);

module.exports = router;
