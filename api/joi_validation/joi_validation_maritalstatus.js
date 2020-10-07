// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_marital_statu_Schema takes , id and name for validation
 */


const maritalstatusSchema = Joi.object({
    maritalstatus_id:  Joi.number(),
    maritalstatus_name:  Joi.string().require(),
})

// exporting the whole module 

module.exports = { maritalstatusSchema}