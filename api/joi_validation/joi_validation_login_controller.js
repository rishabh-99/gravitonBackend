// importing Joi package for validation
const Joi = require('Joi')

/**
 * Represents a Joi Schema.
 * @params , Joi_login_Schema takes , id and name, usernmae, designation
 * user mobile, password, permission and activeness for validation
 */


const loginSchema = Joi.object({
    full_name: Joi.string().required(),
    username: Joi.string().required(),
    designation: Joi.string().required(),
    user_mobile:  Joi.string().required(),
    password: Joi.string().min(3),
    password2: Joi.string().min(3),
    permissions:  Joi.string().required(),
    is_active: Joi.boolean(),

})

// exporting the whole module 
module.exports = { loginSchema}