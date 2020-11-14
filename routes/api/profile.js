const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const Post = require("../../models/Post")
const { check , validationResult, body } = require('express-validator/check')

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Private

router.get('/me', auth , async (req,res)=>{
    try
    {
        const profile = await (await Profile.findOne({user:req.user.id})).populate('user',['name','avatar']);
        if(!profile)
        {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    }
    catch(err)
    {
        console.error(err.message)
        res.status(500).send("Server Error");
    }
});


// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post('/',[auth, [
    check('status','Status is Required').not().isEmpty(),
    check('skills','Skills is Required').not().isEmpty()
]] , async(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ errors : errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //Build Profile Object

    const profileField = {};
    profileField.user = req.user.id;
    if(company){ profileField.company = company }
    if(website){ profileField.website = website }
    if(location){ profileField.location = location }
    if(bio){ profileField.bio = bio }
    if(githubusername){ profileField.githubusername = githubusername }
    if(status){ profileField.status = status }
    if(skills)
    {
        profileField.skills = skills.toString().split(',').map(skill => skill.trim());
    }

    // Build Social Object
    profileField.socials = {}
    if(youtube){ profileField.socials.youtube = youtube }
    if(facebook){ profileField.socials.facebook = facebook }
    if(twitter){ profileField.socials.twitter = twitter }
    if(instagram){ profileField.socials.instagram = instagram }
    if(linkedin){ profileField.socials.linkedin = linkedin }

    try
    {
        let profile = await Profile.findOne({user:req.user.id});
        if(profile)
        {
            profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileField},{new:true})
            return res.json(profile)
        }
        else
        {
            profile = new Profile(profileField)
            await profile.save();
            return res.json(profile)
        }   
    }
    catch(err)
    {
        console.error(err.message)
        res.status(500).send('Server Error')
    }


});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.get('/', async (req,res)=>{
    try {
        const profile = await Profile.find().populate('user',['name','avatar']);
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Error Server")
    }
})

router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({"user":req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({ msg: "Profile not found"})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId')
        {
            return res.status(400).json({msg : 'Profile not found'});
        }
        res.status(500).send("Error Server")
    }
})


// @route   POST api/profile
// @desc    Delete profile,user & Posts
// @access  Private


router.delete('/', async (req,res)=>{
    try {

        await Post.deleteMany({user: req.user.id})
        //Remove Profile
        await Profile.findOneAndDelete({user:req.user.id})
        //Remove User
        await User.findOneAndDelete({_id:req.user.id})

        res.json({ msg : 'User Deleted'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send("Error Server")
    }
})


router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]],async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({
            error:errors.array()
        });
    }

    const {title,company,from,to,location,current,description} = req.body;
    const newExp ={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try
    {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


router.delete("/experience/:exp_id",auth,async (req,res)=>{
    try
    {
        const profile = await Profile.findOne ({user: req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);

        await profile.save();

        res.json(profile);
    }
    catch(err)
    {
        res.status(500).send("Server Error")
    }
});


router.put('/education',[auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]],async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({
            error:errors.array()
        });
    }

    const {school,degree,fieldofstudy,from,to,current,description} = req.body;
    const newEdu ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try
    {
        const profile = await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


router.delete("/education/:edu_id",auth,async (req,res)=>{
    try
    {
        const profile = await Profile.findOne ({user: req.user.id});

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);

        await profile.save();

        res.json(profile);
    }
    catch(err)
    {
        res.status(500).send("Server Error")
    }
});




module.exports = router;