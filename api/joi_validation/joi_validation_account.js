// importing joi for validation 
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_Account_Schema takes , banknmae, ifsc, number, inhandsalary, relatedpan and adhaar
 */



const accountShcema  = Joi.object({

    account_bankname : Joi.string().require(),
    account_ifsc : Joi.string().require().min(2),
    account_number: Joi.string().require().min(4),
    account_inhandsalary: Joi.number().require(),
    account_realtedpan: Joi.string().require(),
    account_realtedaadhar: Joi.string().require().min(5)


})
 
// exporting the whole module 
module.exports = { accountShcema}









