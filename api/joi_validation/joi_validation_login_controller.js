// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @params , Joi_login_Schema takes , id and name, usernmae, designation
 * user mobile, password, permission and activeness for validation
 */


const loginSchema = Joi.object({
    user_id: Joi.number().required(),
    full_name: Joi.string().required(),
    username: Joi.string().required(),
    designation: Joi.string().required(),
    user_mobile:  Joi.string().required(),
    password: Joi.string().min(3),
    permissions:  Joi.object().required(),
    is_active: joi.boolean(),

})

// exporting the whole module 
module.exports = { loginSchema}