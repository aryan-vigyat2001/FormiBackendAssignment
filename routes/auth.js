const express = require('express');
const router = express.Router();
const authController=require('../controllers/auth')

router.post('/signup',authController.postSignup)
router.get('/signup',authController.getSignUp)
router.post('/login',authController.postLogin)
router.get('/login',authController.getLogin)
router.post('/logout',authController.postLogout)
module.exports=router;