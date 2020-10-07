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
/**
 * Represents a joi Schema.
 * @Joi_Acquaintance_Schema takes , id and name 
 */

const acquaintanceSchema = Joi.object({

    acquaintance_id: Joi.number(),
    acquaintance_name: Joi.string().min(3).max(50)
})

/**
 * Represents a joi Schema.
 * @Joi_Borrower_Schema takes , id and details to validate 
 */

const Borrower_details_Schema = Joi.object({

    borrower_id: Joi.number().require(),
    borrower_details:  Joi.string().require(),
})


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

/**
 * Represents a joi Schema.
 * @Joi_category_Schema takes , id and name for validation
 */



const categorySchema = Joi.object({
    category_id: Joi.number().require(),
    category_name: Joi.string().require(),
})

/**
 * Represents a joi Schema.
 * @Joi_caste_Schema takes , id and nmae for validation
 */



const casteSchema = Joi.object({
    caste_id: Joi.number().require(),
    caste_name: Joi.string().require().min(3),

})

/**
 * Represents a joi Schema.
 * @Joi_document_type_Schema takes , id and name for validation
 */


const documenttype_Schema = Joi.object({

    documenttype_id: Joi.number().require(),
    documenttype_name: Joi.string().require(),
})
/**
 * Represents a joi Schema.
 * @Joi_document_Schema takes ,pan, adhaar, optional, cibil, remark , doc id and 
 * progress id for validation
 */


const documentSchema = Joi.object({

    document_pan: Joi.string().require(),
    document_aadhar: Joi.string().require(),
    document_optional: Joi.string(),
    document_cibil: Joi.number().require(),
    document_remark: Joi.string(),
    document_id: Joi.number().require(),
    progress_id: Joi.number(),
    
})

/**
 * Represents a joi Schema.
 * @Joi_gurantor_type_Schema takes , id and name for validation
 */


const gurantor_type_Schema =  Joi.object({

    gurantortype_id: Joi.number().require(),
    gurantortype_name:  Joi.string().require(),
})
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


/**
 * Represents a joi Schema.
 * @Joi_loan_type_Schema takes , id and name for validation
 */


const loan_type_schema = Joi.object({

    loantype_id: Joi.number(),
    loantype_name:  Joi.string().require(),
})

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

/**
 * Represents a joi Schema.
 * @Joi_marital_statu_Schema takes , id and name for validation
 */


const maritalstatusSchema = Joi.object({
    maritalstatus_id:  Joi.number(),
    maritalstatus_name:  Joi.string().require(),
})


/**
 * Represents a joi Schema.
 * @Joi_user_profile_Schema takes , user_id , related_adhaar, 
 * related_pan for validation
 */


const user_profile_Schema = Joi.object({
    user_id:   Joi.number(),
    related_aadhar:  Joi.string().require(),
    related_pan: Joi.string().require(),

})
/**
 * Represents a joi Schema.
 * @Joi_user_kyc_Schema takes , id and user_id, related adaar, related pan
 *  kyc_date  for validation
 */



const user_Kyc_Schema = Joi.object({

    log_id:Joi.number(),
    user_id:  Joi.number(),
    related_aadhar: Joi.string().require(),
    related_pan: Joi.string().require(),
    kyc_date:  Joi.date(),
})


module.exports = {
  accountShcema,
  acquaintanceSchema,
  applicantSchema,
  Borrower_details_Schema,
  casteSchema,
  categorySchema,
  documenttype_Schema,
  documentSchema,
  gurantorSchema,
  gurantor_type_Schema,
  loan_type_schema,
  loanSchema,
  maritalstatusSchema,
  user_Kyc_Schema,
  user_profile_Schema,

}