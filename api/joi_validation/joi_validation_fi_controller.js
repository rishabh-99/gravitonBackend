const Joi = require('joi')

const fiSchema = Joi.object({
  
    fi_id: Joi.number().required(),
    fi_answers: Joi.object().required(),
    
    related_aadhar: Joi.string().regex(/^[0-9]+$/).required(),
    related_pan: Joi.string().regex(/[A-Z]{5}\d{4}[A-Z]{1}/g).required()
})

module.exports = { fiSchema}
