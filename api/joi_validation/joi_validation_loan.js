// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_loan_Schema takes , id and bank name, amount, emi, closureDate, type, related pan and
 *  adhaar  for validation
 */


const loanSchema = Joi.object({

    loan_id:  Joi.number().require(),
    loan_bankname: Joi.string().require().min(3),
    loan_amount: Joi.number(),
    loan_emi:  Joi.number(),
    loan_closuredate: Joi.date().require(),
    loan_type: Joi.number(),
    account_realtedpan:  Joi.string().require().min(3),
    account_realtedaadhar: Joi.string().require().min(3),

})

// exporting the whole module 
module.exports = { loanSchema}