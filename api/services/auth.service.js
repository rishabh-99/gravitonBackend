/*
File Description: Making an Authroization Serive using JWT and Crypto JS
Author: Rishabh Merhotra 
*/

// importing the 3rd party libraries
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");

// ensuring the environment we are wokring on 
const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : '78uighjfyuyu97puoiohgf879';
const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'b14ca5898a4e4133bbce2ea2315a1916';
// encoding Utf8 with parsed EncryptSecret 
var key = CryptoJS.enc.Utf8.parse(encryptSecret);
var iv = CryptoJS.enc.Utf8.parse('b14ca5898a4e4133');
const authService = () => {
  // making the issue fucntion with payloads 
  const issue = (payload) => {

    // => Encryption starts here 
    const encryptedPayload = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    /*
     Encrypting the payloads , utf8 with Stringified Payloads and key..
     Size given to be 128/8. 
      cryptojs for AES encryption
      padding means number of distinct practices 
    */

    }).toString();
    return jwt.sign({ encryptedPayload: encryptedPayload }, jwtSecret, {
      // we make the jwt token expire to maintain privacy or un allowing the thrid user 
      expiresIn: 86400
    })

  };
  const verify = (token, cb) => {
    // => AES decryption by deconding the token by using key and modes 
    const dec = CryptoJS.AES.decrypt(jwt.decode(token).encryptedPayload, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return jwt.verify(token, jwtSecret, {}, cb)
  };   

  // it returns the jwt verification 

  return {
    // returning the issue and verify functions
    issue,
    verify,
  };
};

// exporting the module
module.exports = authService;
