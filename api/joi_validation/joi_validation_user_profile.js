// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_user_profile_Schema takes , user_id , related_adhaar, 
 * related_pan for validation
 */


const user_profile_Schema = Joi.object({
    user_id:   Joi.number(),
    related_aadhar:  Joi.string().require(),
    related_pan: Joi.string().require(),

})

// exporting the whole module
module.exports = { user_profile_Schema}