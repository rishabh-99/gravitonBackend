/*
File Description: Making an Authroization policy using tokens
Author: Rishabh Merhotra 
*/
const JWTService = require('../services/auth.service');

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {

  // using a tokentoverify for authorization 
  let tokenToVerify;
  // accepts  the header format 
  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ');
    // splitting to parts 

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
    // bearer holds the token 
      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        // returns the error
        return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
      }
    } else {
      // returns the error
      return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
    }
  } else if (req.body.token) {
    // verifying if the token is same as requested token 
    tokenToVerify = req.body.token;
    // for safety issues delete the token after use
    delete req.query.token;
  } else {
    return res.status(401).json({ msg: 'No Authorization was found' });
  }

  // returns the function to veify the token using jwt 
  return JWTService().verify(tokenToVerify, (err, thisToken) => {
    if (err) return res.status(401).json({ err });
    //ensuring the token is same as existing token 
    req.token = thisToken;
    return next();
  });
};
