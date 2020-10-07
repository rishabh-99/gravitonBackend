// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_gurantor_type_Schema takes , id and name for validation
 */


const gurantor_type_Schema =  Joi.object({

    gurantortype_id: Joi.number().require(),
    gurantortype_name:  Joi.string().require(),
})

// exporting the whole module 

module.exports = { gurantor_type_Schema}