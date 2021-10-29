const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route  GET api/users
//@desc   Register User
//@access Public
router.post(
    '/',
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
   
   const {name,email,password} = req.body;

   try{
    let user = await User.findOne({ email});
    if(user){
      return res.status(400).json({errors: [{msg: 'User Already Exists'}]}); //since its not the last res.status or res.json
    }
    // See if user Exists

    // Get users gravitar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm' //for default image
    })

    user = new User({
      name,
      email,
      avatar,
      password
    });
    //Encrypt password w/ bcrypt

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    //Return jsonwebtoken(want user to be logged in right away and need this token to log in)

    const payload = {
      user: {
        id: user.id //its _id in mangodb but here mongoose makes it so we can just .id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      {expiresIn: 360000}, //defined in seconds and change back to 3600 after deploy
      (err,token) => {
        if(err) throw err;
        res.json({token});
      }
      );

    //res.send('User registered'); this sends a callback before jwt.sign runs which cuases it to not return a token
   } catch(err){
    console.error(err.message);
    res.status(500).send('Server Error');
   }
   

    
    
});

module.exports = router;
