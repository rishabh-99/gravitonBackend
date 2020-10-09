// importing joi for validation 
const Joi = require('joi')

/**
 * Represents a joi Schema.
 * @params Joi_Account_Schema takes , banknmae, ifsc, number, inhandsalary, relatedpan and adhaar
 */



const registerSchema  = Joi.object({

         user_id: joi.number().require(),

            acccountSchema:{
                account_bankname : Joi.string().required(),
                account_ifsc : Joi.string().min(2).required(),
                account_number: Joi.string().min(4).required(),
                account_inhandsalary: Joi.number().required(),
                account_realtedpan: Joi.string().required(),
                account_realtedaadhar: Joi.string().required()

            } ,
            
/**
 * Represents a joi Schema.
 * @parmas , Joi_Acquaintance_Schema takes , id and name 
 */

                    acquaintanceSchema: {

                    acquaintance_id: Joi.number(),
                    acquaintance_name: Joi.string().min(3).max(50)

                        },

/**
 * Represents a joi Schema.
 * @params Joi_Borrower_Schema takes , id and details to validate 
 */

                    Borrower_details_Schema : {

                    borrower_id: Joi.number().required(),
                    borrower_details:  Joi.string().required(),
                },


/**
 * Represents a joi Schema.
 * @params , Joi_Applicant_Schema takes , firstname, middlename,lastname, acquaintance name , date of birth, state
 * district, pincode, currentaddress, mobile, office no, designation, employer name, office address, 
 * nearest branch, distatance , marital status , caste , user kyc - to Validate 
 */



                applicantSchema: {
                applicant_firstname: Joi.string().required(),
                applicant_middlename: Joi.string(),
                applicant_lastname: Joi.string().required(),
                applicant_acquaintancename:Joi.string().required(),
                applicant_dob: Joi.date().required(),
                applicant_state: Joi.string().required(),
                applicant_district: Joi.string().require().min(4),
                applicant_pincode: Joi.string().require().min(4),
                applicant_currentaddress: Joi.string().min(3).required(),
                applicant_mobile: Joi.string().min(6).required(),
                applicant_officeno: Joi.string().min(6).required(),
                applicant_desgination: Joi.string().required(),
                applicant_education: Joi.string(),
                applicant_employername: Joi.string().min(6).required(),
                applicant_officeaddress: Joi.string().min(6),
                applicant_nearestbranch:  Joi.string(),
                applicant_distance:  Joi.string(),
                applicant_acquaintanceid: Joi.number(),
                applicant_maritalstatusid: Joi.number().require(),
                applicant_casteid: Joi.number(),
                applicant_categoryid: Joi.number(),
                applicant_pan:   Joi.string().min(3),
                applicant_aadhar: Joi.string().min(3),

            },

/**
 * Represents a joi Schema.
 * @params , Joi_category_Schema takes , id and name for validation
 */



                  categorySchema: {
                    category_id: Joi.number().required(),
                    category_name: Joi.string().required(),
                },

/**
 * Represents a joi Schema.
 * @params , Joi_caste_Schema takes , id and nmae for validation
 */



                     casteSchema: {
                        caste_id: Joi.number().required(),
                        caste_name: Joi.string().required(),

                    } ,

/**
 * Represents a joi Schema.
 * @params , Joi_document_type_Schema takes , id and name for validation
 */


                    documenttype_Schema: {

                        documenttype_id: Joi.number().required(),
                        documenttype_name: Joi.string().required(),
                    } ,
/**
 * Represents a joi Schema.
 * @params , Joi_document_Schema takes ,pan, adhaar, optional, cibil, remark , doc id and 
 * progress id for validation
 */


                    documentSchema: {

                        document_pan: Joi.string().required(),
                        document_aadhar: Joi.string().required(),
                        document_optional: Joi.string(),
                        document_cibil: Joi.number().required(),
                        document_remark: Joi.string(),
                        document_id: Joi.number().required(),
                        progress_id: Joi.number(),
                        
                    } ,

/**
 * Represents a joi Schema.
 * @params , Joi_gurantor_type_Schema takes , id and name for validation
 */


                     gurantor_type_Schema: {

                        gurantortype_id: Joi.number().required(),
                        gurantortype_name:  Joi.string().required(),
                    } ,
/**
 * Represents a joi Schema.
 * @params , Joi_gurantor_Schema takes , firstname, middlename, lastname, current Address
 * mobile num, relation , related pan and adhaar with id  for validation
 */


                        gurantorSchema: {
                        gurantor_firstname: Joi.string().required(),
                        gurantor_middlename: Joi.string(),
                        gurantor_lastname:  Joi.string(),
                        gurantor_currentaddress: Joi.string().required(),
                        gurantor_mobile: Joi.string().required(),
                        gurantor_relation: Joi.string().required(),
                        gurantor_realtedpan: Joi.string().required(),
                        gurantor_realtedaadhar: Joi.string().required(),
                        gurantortype_id: Joi.number().required(),

                    } ,


/**
 * Represents a joi Schema.
 * @params , Joi_loan_type_Schema takes , id and name for validation
 */


                        loan_type_schema: {

                            loantype_id: Joi.number(),
                            loantype_name:  Joi.string().required(),
                        },

/**
 * Represents a joi Schema.
 * @params , Joi_loan_Schema takes , id and bank name, amount, emi, closureDate, type, related pan and
 *  adhaar  for validation
 */


                         loanSchema: {

                            loan_id:  Joi.number().required(),
                            loan_bankname: Joi.string().required(),
                            loan_amount: Joi.number(),
                            loan_emi:  Joi.number(),
                            loan_closuredate: Joi.date().required(),
                            loan_type: Joi.number(),
                            account_realtedpan:  Joi.string().min(3),
                            account_realtedaadhar: Joi.string().min(3),

                        },

/**
 * Represents a joi Schema.
 * @params ,Joi_marital_statu_Schema takes , id and name for validation
 */


                         maritalstatusSchema: {
                            maritalstatus_id:  Joi.number(),
                            maritalstatus_name:  Joi.string().required(),
                        },


/**
 * Represents a joi Schema.
 * @params , Joi_user_profile_Schema takes , user_id , related_adhaar, 
 * related_pan for validation
 */


                        user_profile_Schema: {
                            user_id:   Joi.number(),
                            related_aadhar:  Joi.string().required(),
                            related_pan: Joi.string().require(),

                        },
/**
 * Represents a joi Schema.
 * @params , Joi_user_kyc_Schema takes , id and user_id, related adaar, related pan
 *  kyc_date  for validation
 */



                         user_Kyc_Schema : {

                            log_id:Joi.number(),
                            user_id:  Joi.number(),
                            related_aadhar: Joi.string().required(),
                            related_pan: Joi.string().required(),
                            kyc_date:  Joi.date(),
                        }




                    })

module.exports = {

   registerSchema
  }