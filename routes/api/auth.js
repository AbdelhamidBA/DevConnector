const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const config = require('config')
const { check , validationResult, body } = require('express-validator/check')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
// @route   GET api/auth
// @desc    Test route
// @access  Public

router.get('/' , auth , async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    }catch(err)
    {
        res.status(500).send("Server Error :"+err.message);
    }
})

// @route   POST api/auth
// @desc    Authenticate User
// @access  Public

router.post('/',[
    check('email','Email is Required').isEmail(),
    check('password','Password is Required').exists()
], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty)
    {
        return res.status(400).json({ "errors" : errors.array()});
    }
    let email= req.body.email
    let password = req.body.password
    

    try{
        let user = await User.findOne({email});
        if(!user)
        {
           return res.status(400).json({
                'errors' : [ { msg:'Invalid Credentials'}]
            });
        }

        const isMatched = await bcrypt.compare(password,user.password);
        if(!isMatched)
        {
           return res.status(400).json({
                'errors' : [ { msg:'Invalid Credentials'}]
            });
        }

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,config.get('jwtSecert'),{
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err;
            return res.json({
                token
            });
        });

        //res.send("Logged Successfully");
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Server error :"+err.message);
    }


});




module.exports = router;