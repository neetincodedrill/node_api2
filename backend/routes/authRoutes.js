const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')
const requireAuth = require('../middleware/authMiddleware')
const User = require('../model/user')

router.post('/signup', authController.signup_post)
router.post('/login', authController.login_post)

router.put('/:id',requireAuth,async(req, res) => {
        const id = req.params.id;
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            })
            res.status(201).json('Account has been updated');
        }catch(error){
            return res.status(500).send('You can only update your account')
        }
        
})

router.get('/:id',requireAuth,async(req,res) => {
    try{
       const user = await User.findById(req.params.id)
       res.status(200).send('user found')
    }catch(err){
        res.status(400).send('User not found')
    }
})

module.exports = router;