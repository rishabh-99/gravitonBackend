// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_document_Schema takes ,pan, adhaar, optional, cibil, remark , doc id and 
 * progress id for validation
 */


const documentSchema = Joi.object({

    document_pan: Joi.string().require(),
    document_aadhar: Joi.string().require(),
    document_optional: Joi.string(),
    document_cibil: Joi.number().require(),
    document_remark: Joi.string(),
    document_id: Joi.number().require(),
    progress_id: Joi.number(),
    
})

// exporting the whole module 

module.exports = { documentSchema}
