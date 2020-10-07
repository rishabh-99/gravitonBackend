// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_user_kyc_Schema takes , id and user_id, related adaar, related pan
 *  kyc_date  for validation
 */



const user_Kyc_Schema = Joi.object({

    log_id:Joi.number(),
    user_id:  Joi.number(),
    related_aadhar: Joi.string().require(),
    related_pan: Joi.string().require(),
    kyc_date:  Joi.date(),
})

// exporting the whole module 

module.exports = { user_Kyc_Schema}