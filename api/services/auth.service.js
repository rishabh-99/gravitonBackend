const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");


const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : '78uighjfyuyu97puoiohgf879';
const encryptSecret = process.env.NODE_ENV === 'production' ? process.env.ENCRYPT_SECRET : 'b14ca5898a4e4133bbce2ea2315a1916';

var key = CryptoJS.enc.Utf8.parse(encryptSecret);
var iv = CryptoJS.enc.Utf8.parse('b14ca5898a4e4133');
const authService = () => {
  const issue = (payload) => {
    const encryptedPayload = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    return jwt.sign({ encryptedPayload: encryptedPayload }, jwtSecret, {
      expiresIn: 1200
    })

  };
  const verify = (token, cb) => {
    const dec = CryptoJS.AES.decrypt(jwt.decode(token).encryptedPayload, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return jwt.verify(token, jwtSecret, {}, cb)
  };

  return {
    issue,
    verify,
  };
};

module.exports = authService;
