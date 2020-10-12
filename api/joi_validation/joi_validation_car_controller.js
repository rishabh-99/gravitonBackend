// importing joi for validation 
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @params Joi_Account_Schema takes , banknmae, ifsc, number, inhandsalary, relatedpan and adhaar
 */



const registerSchema = Joi.object({

    // user_id: Joi.number().required(),

    accountModel: {
        account_bankname: Joi.optional(),
        account_ifsc: Joi.optional(),
        account_number: Joi.optional(),
        account_inhandsalary: Joi.optional(),
        account_realtedpan: Joi.optional(),
        account_realtedaadhar: Joi.optional()

    },

    /**
     * Represents a joi Schema.
     * @params , Joi_Applicant_Schema takes , firstname, middlename,lastname, acquaintance name , date of birth, state
     * district, pincode, currentaddress, mobile, office no, designation, employer name, office address, 
     * nearest branch, distatance , marital status , caste , user kyc - to Validate 
     */



    applicantModel: {
        applicant_firstname: Joi.string().required(),
        applicant_middlename: Joi.optional(),
        applicant_lastname: Joi.string().required(),
        applicant_acquaintancename: Joi.string().required(),
        applicant_dob: Joi.date().required(),
        applicant_state: Joi.string().required(),
        applicant_district: Joi.string().required().min(4),
        applicant_pincode: Joi.string().required().min(4),
        applicant_currentaddress: Joi.string().min(3).required(),
        applicant_mobile: Joi.string().min(6).required(),
        applicant_officeno: Joi.string().min(6).required(),
        applicant_desgination: Joi.string().required(),
        applicant_education: Joi.string(),
        applicant_employername: Joi.string().min(6).required(),
        applicant_officeaddress: Joi.string().min(6),
        applicant_nearestbranch: Joi.string(),
        applicant_distance: Joi.number(),
        applicant_acquaintanceid: Joi.number(),
        applicant_maritalstatusid: Joi.number().required(),
        applicant_casteid: Joi.number(),
        applicant_categoryid: Joi.number(),
        applicant_pan: Joi.string().min(3),
        applicant_aadhar: Joi.string().min(3),
        DisplaySearch: Joi.string().required()
    },

    /**
     * Represents a joi Schema.
     * @params , Joi_document_Schema takes ,pan, adhaar, optional, cibil, remark , doc id and 
     * progress id for validation
     */


    documentModel: {

        document_pan: Joi.string().required(),
        document_aadhar: Joi.string().required(),
        document_optional: Joi.optional(),
        document_cibil: Joi.number().required(),
        document_remark: Joi.optional(),
        document_id: Joi.number().required(),
        progress_id: Joi.number(),

    },

    /**
     * Represents a joi Schema.
     * @params , Joi_gurantor_Schema takes , firstname, middlename, lastname, current Address
     * mobile num, relation , related pan and adhaar with id  for validation
     */


    gurantorModel: {
        gurantor_firstname: Joi.string().required(),
        gurantor_middlename: Joi.optional(),
        gurantor_lastname: Joi.string(),
        gurantor_currentaddress: Joi.string().required(),
        gurantor_mobile: Joi.string().required(),
        gurantor_relation: Joi.string().required(),
        gurantor_realtedpan: Joi.string().required(),
        gurantor_realtedaadhar: Joi.string().required(),
        gurantortype_id: Joi.number().required(),

    },


    /**
     * Represents a joi Schema.
     * @params , Joi_loan_Schema takes , id and bank name, amount, emi, closureDate, type, related pan and
     *  adhaar  for validation
     */


    loanModel: Joi.array().items(
        Joi.object({
            loan_id: Joi.number().required(),
            loan_bankname: Joi.string().required(),
            loan_amount: Joi.number(),
            loan_emi: Joi.number(),
            loan_closuredate: Joi.optional(),
            loan_type: Joi.number(),
            account_realtedpan: Joi.string().min(3),
            account_realtedaadhar: Joi.string().min(3),
        })
    )
})

module.exports = {

    registerSchema
}