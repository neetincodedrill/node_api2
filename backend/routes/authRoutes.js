const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const requireAuth = require('../middleware/authMiddleware')

//routes
router.get('/:id',requireAuth,authController.get_user)
router.post('/signup', authController.signup_post)
router.post('/login', authController.login_post)
router.put('/update/:id',requireAuth,authController.user_update)

module.exports = router;