const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");


const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : '78uighjfyuyu97puoiohgf879';
const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'b14ca5898a4e4133bbce2ea2315a1916';


const authService = () => {
  const issue = (payload) => {
    const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptSecret, { padding: CryptoJS.pad.NoPadding}).toString()
    const dec = CryptoJS.AES.decrypt(jwt.decode(token).encryptedPayload, encryptSecret, { padding: CryptoJS.pad.NoPadding}).toString(CryptoJS.enc.Utf8);
    console.log(dec)
    return jwt.sign({encryptedPayload}, jwtSecret, {
      expiresIn: 120
    })

  };
  const verify = (token, cb) => {
    const dec = CryptoJS.AES.decrypt(jwt.decode(token).encryptedPayload, encryptSecret, { padding: CryptoJS.pad.NoPadding}).toString(CryptoJS.enc.Utf8);
    console.log(dec)
    return jwt.verify(token, jwtSecret, {}, cb)
  };

  return {
    issue,
    verify,
  };
};

module.exports = authService;
