const express = require('express')
const router = express.Router()
const {body , validationResult} = require('express-validator')
const userModel = require('../models/user.model')
const user = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.get('/register' , (req,res)=>{
    res.render('register')
})

router.post('/register',
    body('email').trim().isEmail(),
    body('password').isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req,res)=>{

        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            // Render register form with errors
            return res.status(400).render('register', {
                errors: errors.array(),
                message: null
            });
        } 
       
        const {email , password , username} = req.body;

        const hashPassword = await bcrypt.hash(password,10)

        try {
            const newUser = await userModel.create({
                email,
                username,
                password:hashPassword
            });
            // Render login form with success message
            return res.render('login', {
                errors: [],
                message: 'Registration successful! Please log in.'
            });
        } catch (err) {
            // Handle duplicate email/username or other DB errors
            let errorsArr = [];
            if (err.code === 11000) {
                if (err.keyPattern && err.keyPattern.email) {
                    errorsArr.push({ msg: 'Email already registered.' });
                }
                if (err.keyPattern && err.keyPattern.username) {
                    errorsArr.push({ msg: 'Username already taken.' });
                }
            } else {
                errorsArr.push({ msg: 'Registration failed. Please try again.' });
            }
            return res.status(400).render('register', {
                errors: errorsArr,
                message: null
            });
        }
})

router.get('/login', (req,res)=>{

    res.render('login')

})

router.post('/login' , 
    body('email').trim().isEmail(),
    body('password').trim().isLength({min:5}),
    async (req,res) => { 

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).render('login', {
                errors: errors.array(),
                message: null
            });
        }

        const {email , password} = req.body;

        const user = await userModel.findOne({
            email:email
        })

        if(!user){
            return res.status(400).render('login', {
                errors: [{ msg: 'Invalid email or password' }],
                message: null
            });
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).render('login', {
                errors: [{ msg: 'Invalid email or password' }],
                message: null
            });
        }

        const token = jwt.sign({
            userId:user._id,
            email:user.email,
            username:user.username
        },
        process.env.JWT_SECRET   
    )

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.redirect("/home");

    })
    



module.exports=router