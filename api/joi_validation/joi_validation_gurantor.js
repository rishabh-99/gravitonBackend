// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_gurantor_Schema takes , firstname, middlename, lastname, current Address
 * mobile num, relation , related pan and adhaar with id  for validation
 */


const gurantorSchema = Joi.object({
    gurantor_firstname: Joi.string().require(),
    gurantor_middlename: Joi.string(),
    gurantor_lastname:  Joi.string(),
    gurantor_currentaddress: Joi.string().require(),
    gurantor_mobile: Joi.string().require(),
    gurantor_relation: Joi.string().require(),
    gurantor_realtedpan: Joi.string().require(),
    gurantor_realtedaadhar: Joi.string().require(),
    gurantortype_id: Joi.number().require(),

})

// exporitng the whole module 
module.exports = { gurantorSchema}