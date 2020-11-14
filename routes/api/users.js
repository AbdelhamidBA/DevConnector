const express = require('express');
const config = require('config')
const { check , validationResult, body } = require('express-validator/check')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require ('../../models/User');
const router = express.Router();

// @route   GET api/Users
// @desc    Register User
// @access  Public

router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ "errors" : errors.array()});
    }
    console.log("Here Stopped")
    let name= req.body.name
    let email= req.body.email
    let password = req.body.password
    

    try{
        let user = await User.findOne({email});
        if(user)
        {
           return res.status(400).json({
                'errors' : [ { msg:'User already exists'}]
            });
        }

        const avatar = gravatar.url(email , {
            s:'100',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            password,
            avatar
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        
        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,config.get('jwtSecert'),{
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err;
            res.json({
                token
            });
        });


    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Server error :"+err.message);
    }


});


module.exports = router;