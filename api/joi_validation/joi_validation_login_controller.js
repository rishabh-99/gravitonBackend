// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @params , Joi_login_Schema takes , id and name, usernmae, designation
 * user mobile, password, permission and activeness for validation
 */


const loginSchema = Joi.object({
    user_id: Joi.number().require(),
    full_name: Joi.string().require(),
    username: Joi.string().require(),
    designation: Joi.string().require(),
    user_mobile:  Joi.string().require(),
    password: Joi.string().require().min(3),
    permissions:  Joi.object().require(),
    is_active: joi.boolean(),

})

// exporting the whole module 
module.exports = { loginSchema}