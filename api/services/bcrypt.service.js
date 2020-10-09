/*
File Description: Making the Becrypt service  for passwords using salt and hashing techniques
Author: Rishabh Merhotra 
*/


const bcrypt = require('bcrypt-nodejs');

const bcryptService = () => {
  
  const password = (user) => {
    // getting the password of the user 
    // password => Salt * user.password => hash 
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    // returns the hashed password
    return hash;
  };

  // comparing the hash password with raw password 
  const comparePassword = (pw, hash) => (
   // becryt performs the compare sync 
    bcrypt.compareSync(pw, hash)
  );

  return {
    // returns the passwords and compare passwords
    password,
    comparePassword,
  };
};
// exporting the whole module
module.exports = bcryptService;
