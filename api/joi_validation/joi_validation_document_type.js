// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_document_type_Schema takes , id and name for validation
 */


const documenttype_Schema = Joi.object({

    documenttype_id: Joi.number().require(),
    documenttype_name: Joi.string().require(),
})

// exporting the whole module 

module.exports = { documenttype_Schema}