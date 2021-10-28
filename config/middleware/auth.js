const jwt = require('jsonwebtoken');
const config = require('config');
// next is for a call back that has to be ran when done to go to next middleware pice
module.exports = function(req, res, next){
    //Get token from header
    const token = req.header('x-auth-token'); //header key that we want to send with token

    //Check if not token
    if(!token){
        //401 i snot authorized
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    //Verify token
    try{
        const decoded = jwt.verify(token,config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}

// her wer export middleware token the get a token from the header and if there is no token that is there and it is still protencted then
//it will just say denied and if it is valid it till use decoded to verify then use becomes the decoded user and can be used in any decoded routes