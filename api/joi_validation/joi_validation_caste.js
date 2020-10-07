// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_caste_Schema takes , id and nmae for validation
 */



const casteSchema = Joi.object({
    caste_id: Joi.number().require(),
    caste_name: Joi.string().require().min(3),

})

module.exports = { casteSchema}