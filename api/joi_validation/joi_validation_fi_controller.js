

/* File Description: Controlling the Api For all Fi related tasks by registering and Joi Validation included
Author: Rishabh Mehrothra
*/

const Joi = require('joi')

const fiSchema = Joi.object({
  
    fi_id: Joi.number().required(),
    fi_answers: Joi.json().required(),
    related_aadhar: Joi.string().regex('d{12}').required(),
    related_pan: Joi.alphaNumeric().regex('[A-Z]{5}[0-9]{4}[A-Z]{1}').required()
})

module.exports = { fiSchema}
