// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_loan_type_Schema takes , id and name for validation
 */


const loan_type_schema = Joi.object({

    loantype_id: Joi.number(),
    loantype_name:  Joi.string().require(),
})

// exporting the whole module 
module.exports = { loan_type_schema}