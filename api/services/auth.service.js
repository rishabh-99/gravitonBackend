const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");

const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : '78uighjfyuyu97puoiohgf879';
const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'd984urifjksdcasofdhasafae';

const authService = () => {
  const issue = (payload) => {
    const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptSecret).toString()
    return jwt.sign({encryptedPayload}, jwtSecret, {
      expiresIn: 120
    })

  };
  const verify = (token, cb) => {
    const dec = CryptoJS.AES.decrypt(jwt.decode(token).encryptedPayload, encryptSecret).toString(CryptoJS.enc.Utf8);
    console.log(dec)
    return jwt.verify(token, jwtSecret, {}, cb)
  };

  return {
    issue,
    verify,
  };
};

module.exports = authService;
