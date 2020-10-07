// importing joi package for validation
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @Joi_category_Schema takes , id and name for validation
 */



const categorySchema = Joi.object({
    category_id: Joi.number().require(),
    category_name: Joi.string().require(),
})

module.exports = { categorySchema}