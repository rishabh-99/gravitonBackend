// joi for the validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_Acquaintance_Schema takes , id and name 
 */



const acquaintanceSchema = Joi.object({

    acquaintance_id: Joi.number(),
    acquaintance_name: Joi.string().min(3).max(50)
})
// exporting the whole module

module.exports = { acquaintanceSchema}