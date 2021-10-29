const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
//@route  Post api/auth
//@desc   Authenticate user and get token
//@access Public
router.get('/',auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post(
    '/',
    [ //what does this do?
    check('email', 'Please include a valid email').isEmail(),
    check('password','Password is required').exists()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
   
   const { email,password} = req.body;

   try{
    let user = await User.findOne({ email});
    if(!user){
      return res
      .status(400)
      .json({errors: [{msg: 'Invalid Credentials'}]}); //since its not the last res.status or res.json
    }
    // See if user Exists

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res
        .status(400)
        .json({errors: [{msg: 'Invalid Credentials'}]}); //use same response so they cant see if there is no use when they get it wrong
    }

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
