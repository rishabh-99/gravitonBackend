// importing the joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_Borrower_Schema takes , id and details to validate 
 */

const Borrower_details_Schema = Joi.object({

    borrower_id: Joi.number().require(),
    borrower_details:  Joi.string().require(),
})

// exporting the whole module 

module.exports = {Borrower_details_Schema}