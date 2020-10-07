// joi package for validation 
const Joi = require('joi')


/**
 * Represents a joi Schema.
 * @Joi_Applicant_Schema takes , firstname, middlename,lastname, acquaintance name , date of birth, state
 * district, pincode, currentaddress, mobile, office no, designation, employer name, office address, 
 * nearest branch, distatance , marital status , caste , user kyc - to Validate 
 */



const applicantSchema = Joi.object({
    applicant_firstname: Joi.string().require(),
    applicant_middlename: Joi.string(),
    applicant_lastname: Joi.string().require(),
    applicant_acquaintancename:Joi.string().require(),
    applicant_dob: Joi.date().require(),
    applicant_state: Joi.string().require(),
    applicant_district: Joi.string().require().min(4),
    applicant_pincode: Joi.string().require().min(4),
    applicant_currentaddress: Joi.string().require().min(3),
    applicant_mobile: Joi.string().require().min(6),
    applicant_officeno: Joi.string().require().min(6),
    applicant_desgination: Joi.string().require(),
    applicant_education: Joi.string(),
    applicant_employername: Joi.string().require().min(6),
    applicant_officeaddress: Joi.string().require().min(6),
    applicant_nearestbranch:  Joi.string(),
    applicant_distance:  Joi.string(),
    applicant_acquaintanceid: Joi.number(),
    applicant_maritalstatusid: Joi.number().require(),
    applicant_casteid: Joi.number(),
    applicant_categoryid: Joi.number(),
    applicant_pan:   Joi.string().require().min(3),
    applicant_aadhar: Joi.string().require().min(3),

})

// exporting the whole module 

module.exports = { applicantSchema}