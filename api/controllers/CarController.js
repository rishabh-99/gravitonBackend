/*
File DEscription: Creating a controller to perform API operations with database
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation 
*/
// Importing all the models from the model folder 
const Document = require('../models/Document');
const Gurantor = require('../models/Gurantor');
const Applicant = require('../models/Applicant');
const Account = require('../models/Account');
const Loan = require('../models/Loan');
const MaritalStatus = require('../models/MaritalStatus');
const Acquaintance = require('../models/Acquaintance');
const Caste = require('../models/Caste');
const Category = require('../models/Category');
const Gurantortype = require('../models/Gurantortype');
const Documenttype = require('../models/Documenttype');
const Loantype = require('../models/Loantype');
const User_kyc_log = require('../models/User_kyc_log');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


// importing the database confifurations from the datavbase folder 
const sequelize = require('../../config/database');
// importing the borrower model from the models folder 
const Borrower_incredo_details = require('../models/Borrower_incredo_details');

// importing joi Schemas 
const { registerSchema } = require('../joi_validation/joi_validation_car_controller');
const UserProfile = require('../models/User-profile');
const Login = require('../models/Login');
const KycApprovalPending = require('../models/Kyc_approval_pending');
const FiAssignedPending = require('../models/Fi_assigned_pending');
const authService = require('../services/auth.service');
const DisbursedLoan = require('../models/DisbursedLoan');
const Leads = require('../models/Leads');





// Defining a controller
const CarController = () => {
    // defining a function inside a controller 
    const register = async (req, res) => {
        const { body } = req;   //req.body 
        try {
            const user_id = req.query.user_id  // user_id.integer()


            const result = await sequelize.transaction(async (t) => {
                /**
                 * Creating a Document 
                 * @param {req} body - Document is created using, document_pan, document adhaar, document_optional
                 * , document_cibil, document_remark, document_id and progress id
                 * @param document - stored in the document 
                 */
                const document = await Document.create({
                    'document_pan': body.documentModel.document_pan,
                    'document_aadhar': body.documentModel.document_aadhar,
                    'document_optional': body.documentModel.document_optional,
                    'document_cibil': body.documentModel.document_cibil,
                    'document_remark': body.documentModel.document_remark,
                    'document_id': body.documentModel.document_id,
                    'progress_id': body.documentModel.progress_id
                }, { transaction: t });


                // Creating a gurantor with given parameters
                /**
                 * Creating a Gurantor 
                 * @param {req} body -
                 * Gurantor- created using , firstname, lastname, middlename, currentAddress, mobile, relation, 
                 * id, related pan and related Adhaar 
                 * Gurantor is created.      
                 */
                const gurantor = await Gurantor.create({
                    'gurantor_firstname': body.gurantorModel.gurantor_firstname,
                    'gurantor_middlename': body.gurantorModel.gurantor_middlename,
                    'gurantor_lastname': body.gurantorModel.gurantor_lastname,
                    'gurantor_currentaddress': body.gurantorModel.gurantor_currentaddress,
                    'gurantor_mobile': body.gurantorModel.gurantor_mobile,
                    'gurantor_relation': body.gurantorModel.gurantor_relation,
                    'gurantortype_id': body.gurantorModel.gurantortype_id,
                    'gurantor_realtedpan': body.gurantorModel.gurantor_realtedpan,
                    'gurantor_realtedaadhar': body.gurantorModel.gurantor_realtedaadhar,

                }, { transaction: t });

                /**
                 * Creating an applicant.
                 * @constructor
                 * @param {req} body - Takes the following paramters
                 * @applicant- Firstname,middlename, lastname, acquaintancename, date of birth, state, district, 
                 * pincode, currentaddress, mobile, office no, designation, education, employername, offcice address,
                 * nearest branch. category, distance, marital status, caste id
                 * Applicant created 
                 */
                const applicant = await Applicant.create({
                    'applicant_firstname': body.applicantModel.applicant_firstname,
                    'applicant_middlename': body.applicantModel.applicant_middlename,
                    'applicant_lastname': body.applicantModel.applicant_lastname,
                    'applicant_acquaintancename': body.applicantModel.applicant_acquaintancename,
                    'applicant_dob': body.applicantModel.applicant_dob,
                    'applicant_state': body.applicantModel.applicant_state,
                    'applicant_district': body.applicantModel.applicant_district,
                    'applicant_pincode': body.applicantModel.applicant_pincode,
                    'applicant_currentaddress': body.applicantModel.applicant_currentaddress,
                    'applicant_mobile': body.applicantModel.applicant_mobile,
                    'applicant_officeno': body.applicantModel.applicant_officeno,
                    'applicant_desgination': body.applicantModel.applicant_desgination,
                    'applicant_education': body.applicantModel.applicant_education,
                    'applicant_employername': body.applicantModel.applicant_employername,
                    'applicant_officeaddress': body.applicantModel.applicant_officeaddress,
                    'applicant_nearestbranch': body.applicantModel.applicant_nearestbranch,
                    'applicant_distance': body.applicantModel.applicant_distance,
                    'applicant_acquaintanceid': body.applicantModel.applicant_acquaintanceid,
                    'applicant_maritalstatusid': body.applicantModel.applicant_maritalstatusid,
                    'applicant_casteid': body.applicantModel.applicant_casteid,
                    'applicant_categoryid': body.applicantModel.applicant_categoryid,
                    'applicant_pan': body.applicantModel.applicant_pan,
                    'applicant_aadhar': body.applicantModel.applicant_aadhar
                }, { transaction: t });

                const account = await Account.create({
                    'account_bankname': body.accountModel.account_bankname,
                    'account_ifsc': body.accountModel.account_ifsc,
                    'account_number': body.accountModel.account_number,
                    'account_inhandsalary': body.accountModel.account_inhandsalary,
                    'account_realtedpan': body.accountModel.account_realtedpan,
                    'account_realtedaadhar': body.accountModel.account_realtedaadhar
                }, { transaction: t });

                var loans = []
                for (var i = 0; i < body.loanModel.length; i++) {
                    // pushing all the loan details into a single arary loan[]
                    loans.push(
                        /**
                         * Making a loan list
                         * @constructor
                         * @param {req} body - accepts the req.body
                         * @loan is created with- bankname, amount, emi, closuredate, 
                         * type, related pan and related adhaar 
                         */
                        await Loan.create({
                            'loan_bankname': body.loanModel[i].loan_bankname,
                            'loan_amount': body.loanModel[i].loan_amount,
                            'loan_emi': body.loanModel[i].loan_emi,
                            'loan_closuredate': body.loanModel[i].loan_closuredate,
                            'loan_type': body.loanModel[i].loan_type,
                            'account_realtedpan': body.loanModel[i].account_realtedpan,
                            'account_realtedaadhar': body.loanModel[i].account_realtedaadhar
                        }, { transaction: t })

                    );

                }
                // Getting the date and month details
                var today = new Date();
                var dd = today.getDate();

                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                // today = dd + '-' + mm + '-' + yyyy;
                today = yyyy + '-' + mm + '-' + dd;



                const log = await User_kyc_log.create({
                    'user_id': req.query.user_id,
                    'related_aadhar': body.documentModel.document_aadhar,
                    'related_pan': body.documentModel.document_pan,
                    'kyc_date': today
                }, { transaction: t })
                const ran = Math.floor(100000 + Math.random() * 900000)
                const user_id = parseInt(`100011100${ran}`)
                const documentModel = body.documentModel;
                const gurantorModel = body.gurantorModel;
                const applicantModel = body.applicantModel;
                const accountModel = body.accountModel;
                const loanModel = body.loanModel;

                const userProfileModel = await UserProfile.create(
                    {
                        'user_id': user_id,
                        'details_json': {
                            [user_id]: {
                                "__id": user_id,
                                "general_detail": {
                                    "name": applicantModel.applicant_firstname,
                                },
                                "mone_history": {
                                    "contact": applicantModel.applicant_mobile,
                                    "cibil_score": documentModel.document_cibil,
                                },
                                "loans": [],
                                "kyc": {
                                    "CarJSON": { documentModel, gurantorModel, applicantModel, accountModel, loanModel }
                                },
                                "documents": []
                            }
                        },
                        'related_aadhar': documentModel.document_aadhar,
                        'related_pan': documentModel.document_pan
                    }, { transaction: t })

                return { userProfileModel };
            });


            return res.status(200).json(result.userProfileModel.details_json)
        } catch (err) {
            console.log(err);
            // 500 error returns "internal server error"
            return res.status(500).json({ msg: err });
        }

    };
    // accepts a request and responds accordingly
    const get = async (req, res) => {
        // const { body } = req;
        const aadhar = req.query.aadhar
        try {
            // finding all the documents with a paramater Adhaar 
            const documentModel = await Document.findAll({
                where: {
                    'document_aadhar': aadhar
                }
            });
            // finding all the gurantors with a paramater Adhaar 
            const gurantorModel = await Gurantor.findAll({
                where: {
                    'gurantor_realtedaadhar': aadhar
                }
            });
            // finding all the applicants  with a paramater Adhaar 
            const applicantModel = await Applicant.findAll({
                where: {
                    'applicant_aadhar': aadhar
                }
            });
            // finding all the accounts with a paramater Adhaar 
            const accountModel = await Account.findAll({
                where: {
                    'account_realtedaadhar': aadhar
                }
            });
            // finding all the loans with a paramater Adhaar 
            const loanModel = await Loan.findAll({
                where: {
                    'account_realtedaadhar': aadhar
                }
            })
            // => req for profile 
            // return {document, gurantor, applicant, account, loans};
            // returns the 200 ok! with json objects
            return res.status(200).json({ documentModel, gurantorModel, applicantModel, accountModel, loanModel });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err });
        }
    };
    // get the Adhaar list upon request and response
    const getAadharList = async (req, res) => {
        try {
            // gets all the documents with the Attribute Document-Adhar 
            const Aadhar = await Document.findAll({
                attributes: ['document_aadhar']
            })
                // returns a promise and we map it to document.document_aadhar
                .then(document => document.map(document => document.document_aadhar));
            console.log(Aadhar)
            // 200 returns a ok! and sends Aadhar object 
            return res.status(200).send(Aadhar)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };
    // Getting all the pancard lists in the documents 
    const getPanList = async (req, res) => {
        try {
            const Pan = await Document.findAll({
                attributes: ['document_pan'],

            })
                .then(document => document.map(document => document.document_pan));
            console.log(typeof (Pan))
            // returns 200 ok! and pan object 
            return res.status(200).send(Pan)
        } catch (err) {
            // catches the error to "internal server error"
            return res.status(500).json({ msg: err });
        }
    };

    const getFnameAndAadhar = async (req, res) => {
        try {
            const NameWithAadhar = await Applicant.findAll({
                attributes: ['applicant_aadhar', 'applicant_firstname'],

            })
                .then(applicant => applicant.map(applicant => `${applicant.applicant_firstname} : ${applicant.applicant_aadhar}`));
            console.log(NameWithAadhar)
            return res.status(200).send(NameWithAadhar)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getComboBoxData = async (req, res) => {
        try {
            const MaritalStatusModel = await MaritalStatus.findAll();
            const AcquaintanceModel = await Acquaintance.findAll();
            const CasteModel = await Caste.findAll();
            const CategoryModel = await Category.findAll();
            const GurantortypeModel = await Gurantortype.findAll();
            const LoantypeModel = await Loantype.findAll();
            const DocumenttypeModel = await Documenttype.findAll();

            return res.status(200).send({ MaritalStatusModel, AcquaintanceModel, CasteModel, CategoryModel, GurantortypeModel, LoantypeModel, DocumenttypeModel })
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getCountOfKyc = async (req, res) => {
        try {
            // Date info 
            var today = new Date();
            var dd = today.getDate();

            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            // today = dd + '-' + mm + '-' + yyyy;
            today = yyyy + '-' + mm + '-' + dd;
            const count = await User_kyc_log.count({
                // count with the user_id and date
                where: {
                    'user_id': req.query.user_id,
                    'kyc_date': today
                }
            })

            return res.status(200).send({ count })
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const insertBorrowerDetails = async (req, res) => {
        try {
            // creating a borrower id before insertion 
            await Borrower_incredo_details.create({
                'borrower_id': req.body.borrower_id,
                'borrower_details': req.body.borrower_details
            })



            return res.status(200).send({ msg: 'Successfull' })
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getUserProfileID = async (req, res) => {
        // profile_id, name, aadhar number
        try {
            const profileList = await sequelize.query(`SELECT user_id, related_aadhar,
            CASE WHEN applicant_middlename Like '' 
                    THEN concat(applicant_firstname,' ', applicant_lastname)
                    ELSE concat(applicant_firstname,' ',applicant_middlename,' ', applicant_lastname) 
            END AS applicant_name FROM public.user_profile, public.applicant where applicant.applicant_aadhar = user_profile.related_aadhar;`)

            return res.status(200).send(profileList[0])
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getProfileForProfileID = async (req, res) => {
        const user_id = req.query.user_id
        try {
            const profile = await UserProfile.findOne({
                attributes: ['details_json'],
                where: {
                    user_id
                }
            })

            return res.status(200).send(profile.details_json)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const insertNewLoan = async (req, res) => {
        const user_id = req.body.user_id;
        const loan_type = req.body.loan_type;
        try {
            const profile = await UserProfile.findOne({
                where: {
                    user_id: user_id
                }
            });
            function getRandomString(length) {
                var randomChars = 'abcdefghijklmnopqrstuvwxyz';
                var result = '';
                for (var i = 0; i < length; i++) {
                    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                return result;
            }
            const newLoanId = getRandomString(6)
            profile.details_json[user_id].loans = [...profile.details_json[user_id].loans,
            {

                "__loan_id": newLoanId,
                "loan_type": loan_type,
                "stages": {
                    "kyc_approval": {
                        "status": false,
                    },
                    "fi_assigned": {
                        "status": false,
                    },
                    "fi_submitted": {
                        "status": false,
                    },
                    "fi_approval": {
                        "status": false,
                    },
                    "document_check_upload": {
                        "status": false,
                    },
                    "document_check_approve": {
                        "status": false,
                    },
                    "emi_schedule": {
                        "status": false,
                    },
                    "current_stage": "new"
                },
                "assigned_to": {},
                "fi_data": {},
                "emi_schedule": {}

            }]

            await UserProfile.update({
                'details_json': profile.details_json
            }, { where: { 'user_id': user_id } });

            await KycApprovalPending.create({
                'profile_id': user_id,
                'loan_id': newLoanId,
            })
            return res.status(200).json({ msg: 'Operation Successfull' })
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getPreSignedUrl = async (req, res) => {
        const profile_id = req.query.profile_id;
        const loan_id = req.query.__loan_id
        const filename = req.query.filename
        try {

            let profile = await UserProfile.findOne({
                where: {
                    user_id: profile_id
                }
            });
            let counter = 0;
            let loanNumber = 0;
            for (let loan of profile.details_json[profile_id].loans) {
                if (loan.__loan_id == loan_id) {
                    loanNumber = counter;
                }
                counter++;
            }

            if (profile.details_json[profile_id].loans[loanNumber].inkredoFiles instanceof Array) {
                profile.details_json[profile_id].loans[loanNumber].inkredoFiles.push(`${filename}`)
            }
            else {
                profile.details_json[profile_id].loans[loanNumber].inkredoFiles = [`${filename}`]
            }

            console.log(profile.details_json[profile_id].loans[loanNumber].inkredoFiles)

            await UserProfile.update({
                'details_json': profile.details_json
            }, { where: { 'user_id': profile_id } })
            // console.log(JSON.parse(process.env.S3_BUCKET))
            const preSignedUrl = await s3.getSignedUrlPromise('putObject', {
                Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
                Key: `Inkredo/${req.query.loan_type}/${req.query.profile_id}/${req.query.__loan_id}/${req.query.filename}`, // File name could come from queryParameters
                Metadata: {}
            });

            // const storageUrl = `https://my-express-application-dev-s3bucket-1eil6gs9s5nx2.s3.ap-south-1.amazonaws.com/${req.query.filename}`
            return res.status(200).json(preSignedUrl)
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getPreSignedUrlForRetrieval = async (req, res) => {
        try {
            // console.log(JSON.parse(process.env.S3_BUCKET))
            const preSignedUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
                Key: `Inkredo/${req.query.loan_type}/${req.query.profile_id}/${req.query.__loan_id}/${req.query.filename}`, // File name could come from queryParameters
            });

            // const storageUrl = `https://my-express-application-dev-s3bucket-1eil6gs9s5nx2.s3.ap-south-1.amazonaws.com/${req.query.filename}`
            return res.status(200).json(preSignedUrl)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const approveKYC = async (req, res) => {
        const user_id = req.query.user_id;
        const __loan_id = req.query.__loan_id;
        const approve_status = req.query.approve_status;
        const remark = req.query.remark;

        try {
            let profile = await UserProfile.findOne({
                where: {
                    user_id: user_id
                }
            })
            let counter = 0;
            let loanNumber = 0;
            for (let loan of profile.details_json[user_id].loans) {
                if (loan.__loan_id == __loan_id) {
                    loanNumber = counter;
                }
                counter++;
            }
            const date = new Date();
            profile.details_json[user_id].loans[loanNumber].stages.kyc_approval.status = true;
            profile.details_json[user_id].loans[loanNumber].stages.kyc_approval.approve_status = approve_status;
            profile.details_json[user_id].loans[loanNumber].stages.kyc_approval.time_stamp = date.toLocaleString();
            profile.details_json[user_id].loans[loanNumber].stages.kyc_approval.remark = remark;
            profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'kyc_approval';


            await UserProfile.update({
                'details_json': profile.details_json
            }, { where: { 'user_id': user_id } })

            if (approve_status === 'true') {
                await FiAssignedPending.create({
                    'profile_id': user_id,
                    'loan_id': __loan_id
                })

                await KycApprovalPending.destroy({
                    where: {
                        'profile_id': user_id
                    }
                })
            }


            return res.status(200).json({ msg: 'Operation Successful' })
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getAgentNameForKYC = async (req, res) => {
        const related_aadhar = req.query.related_aadhar
        try {
            const log = await User_kyc_log.findOne({
                where: {
                    'related_aadhar': related_aadhar
                },
                attributes: ['user_id']
            });

            const name = await Login.findOne({
                where: {
                    user_id: log.user_id
                },
                attributes: ['full_name']
            })
            return res.status(200).json(name.full_name);
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const terminateLoan = async (req, res) => {
        const profile_id = req.query.profile_id;
        const loan_id = req.query.loan_id;
        const remark = req.query.remark;
        const password = req.query.password;

        try {
            let tokenToVerify;
            // accepts  the header format 
            if (req.header('Authorization')) {
                const parts = req.header('Authorization').split(' ');
                // splitting to parts 

                if (parts.length === 2) {
                    const scheme = parts[0];
                    const credentials = parts[1];
                    // bearer holds the token 
                    if (/^Bearer$/.test(scheme)) {
                        tokenToVerify = credentials;
                    }
                }
            }
            console.log({ tokenToVerify })
            const verified = await authService().verifyUser(tokenToVerify, password);

            if (verified) {

                let profile = await UserProfile.findOne({
                    where: {
                        user_id: profile_id
                    }
                });

                let counter = 0;
                let loanNumber = 0;
                for (let loan of profile.details_json[profile_id].loans) {
                    if (loan.__loan_id == loan_id) {
                        loanNumber = counter;
                    }
                    counter++;
                }

                profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'Terminated';
                profile.details_json[profile_id].loans[loanNumber].loanStatus = { status: 'Terminated', remark };

                await UserProfile.update({
                    'details_json': profile.details_json
                }, { where: { 'user_id': profile_id } })


                return res.status(200).send('Operation successfull!');

            } else {
                return res.status(400).json({ msg: 'Incorrect Password' })
            }
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const resubmitKYC = async (req, res) => {
        const profile_id = req.query.profile_id;
        const loan_id = req.query.loan_id;
        const remark = req.query.remark;

        try {
            let profile = await UserProfile.findOne({
                where: {
                    user_id: profile_id
                }
            });

            let counter = 0;
            let loanNumber = 0;
            for (let loan of profile.details_json[profile_id].loans) {
                if (loan.__loan_id == loan_id) {
                    loanNumber = counter;
                }
                counter++;
            }

            const date = new Date();
            profile.details_json[profile_id].loans[loanNumber].stages.kyc_approval.status = false;
            profile.details_json[profile_id].loans[loanNumber].stages.kyc_approval.time_stamp = date.toLocaleString();
            profile.details_json[profile_id].loans[loanNumber].stages.kyc_approval.remark = remark;
            profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'kyc_approval';

            await UserProfile.update({
                'details_json': profile.details_json
            }, { where: { 'user_id': profile_id } })

        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const finishLoan = async (req, res) => {
        const profile_id = req.query.profile_id;
        const loan_id = req.query.loan_id;


        try {
            let profile = await UserProfile.findOne({
                where: {
                    user_id: profile_id
                }
            });

            let counter = 0;
            let loanNumber = 0;
            for (let loan of profile.details_json[profile_id].loans) {
                if (loan.__loan_id == loan_id) {
                    loanNumber = counter;
                }
                counter++;
            }

            profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'Completed';
            profile.details_json[profile_id].loans[loanNumber].loanStatus = { status: 'Completed' };

            await UserProfile.update({
                'details_json': profile.details_json
            }, { where: { 'user_id': profile_id } })

            await DisbursedLoan.create({
                profile_id, loan_id
            })

            return res.status(200).send('Operation successfull!');


        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getAdminPanelData = async (req, res) => {

        try {
            let count = 5;
            const countOfProfiles = await UserProfile.count({
                where: {}
            });
            if (countOfProfiles < 5) {
                count = countOfProfiles;
            }
            //date and user_id
            const q1 = await sequelize.query(`select up.user_id, ap.applicant_firstname, ukl.full_name, ukl.kyc_date from 
            (SELECT user_id, related_aadhar FROM user_profile as up LIMIT ${count} OFFSET 
             (select count(*) from user_profile)-${count}) as up,
             applicant as ap,
             (select * from user_kyc_log as ukli, login as li where ukli.user_id = li.user_id) as ukl
             where up.related_aadhar = ap.applicant_aadhar and up.related_aadhar = ukl.related_aadhar`)

            const newestKYC = q1[0];
            const countOfDisbursedLoan = await DisbursedLoan.count({
                where: {}
            })
            return res.status(200).json({ countOfProfiles, newestKYC, countOfDisbursedLoan });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const createLead = async (req, res) => {
        const user_id = parseInt(req.query.user_id);
        const data = req.body;
        const name = req.query.name;
        const loan_type = req.query.loan_type;
        const amount = req.query.amount;

        try {
            await Leads.create({
                user_id, data, name, loan_type, amount
            })
            return res.status(200).json({ msg: 'Operation Successful!' });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getLeadForToken = async (req, res) => {
        const token = parseInt(req.query.token);
        try {
            const lead = await Leads.findOne({
                attributes: ['data', 'loan_type', 'amount'],
                where: { token }
            })
            return res.status(200).json(lead);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getAllLeads = async (req, res) => {
        try {
            const lead = await sequelize.query(`SELECT token, leads.user_id, created_at, name, loan_type, amount, full_name
            FROM public.leads, public.login where leads.user_id = login.user_id;`)
            return res.status(200).json(lead[0]);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getLeadForUserId = async (req, res) => {
        const user_id = parseInt(req.query.user_id);
        try {
            const lead = await sequelize.query(`SELECT token, leads.user_id, created_at, name, loan_type, amount, full_name
            FROM public.leads, public.login where leads.user_id = login.user_id and leads.user_id =${user_id}`)
            return res.status(200).json(lead[0]);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getKYCData = async (req, res) => {

        try {


            const q1 = await sequelize.query(`select up.user_id, ap.applicant_firstname, ukl.full_name, ukl.kyc_date, ap.applicant_mobile from 
            (SELECT user_id, related_aadhar FROM user_profile) as up,
             applicant as ap,
             (select * from user_kyc_log as ukli, login as li where ukli.user_id = li.user_id) as ukl
             where up.related_aadhar = ap.applicant_aadhar and up.related_aadhar = ukl.related_aadhar;`)

            return res.status(200).send(q1[0]);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const deleteLead = async (req, res) => {

        const token = parseInt(req.query.token);
        try {


            await Leads.destroy({
                where: {
                    token
                }
            })

            return res.status(200).send({ msg: 'Operation successful' });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getListOfProfileIdForUser = async (req, res) => {

        const user_id = parseInt(req.query.user_id);
        try {
            const r = await sequelize.query(`SELECT user_profile.user_id, user_profile.related_aadhar,
            CASE WHEN applicant_middlename Like '' 
                    THEN concat(applicant_firstname,' ', applicant_lastname)
                    ELSE concat(applicant_firstname,' ',applicant_middlename,' ', applicant_lastname) 
            END AS applicant_name FROM public.user_profile, public.applicant,public.user_kyc_log where applicant.applicant_aadhar = user_profile.related_aadhar
			and applicant_aadhar = user_kyc_log.related_aadhar and user_kyc_log.user_id =${user_id}`)
            return res.status(200).send(r[0]);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getAdminPanelDataForUser = async (req, res) => {

        const user_id = req.query.user_id
        try {
            let count = 5;
            const countOfProfiles = await User_kyc_log.count({
                where: {user_id}
            });
            if (countOfProfiles < 5) {
                count = countOfProfiles;
            }
            //date and user_id
            const q1 = await sequelize.query(`select up.user_id, ap.applicant_firstname, ukl.kyc_date
            from user_profile as up, (select * from user_kyc_log where user_id = ${user_id}) as ukl, applicant as ap
            where up.related_aadhar = ukl.related_aadhar and ukl.related_aadhar = ap.applicant_aadhar limit ${count} offset (select count(*) from user_kyc_log where user_id = ${user_id})-${count};
                       `)

            const newestKYC = q1[0];
            const cdl = await sequelize.query(`select count(*) from public."disbursedLoan" as dl, public.user_profile as up, public.user_kyc_log as ukl where dl.profile_id = up.user_id and up.related_aadhar = ukl.related_aadhar and ukl.user_id = ${user_id}`);
            const countOfDisbursedLoan = cdl[0][0].count
            return res.status(200).json({ countOfProfiles, newestKYC, countOfDisbursedLoan });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };

    const getKYCDataForUserId = async (req, res) => {
        const user_id = req.query.user_id;
        try {


            const q1 = await sequelize.query(`select up.user_id, ap.applicant_firstname, ukl.full_name, ukl.kyc_date, ap.applicant_mobile from 
            (SELECT user_id, related_aadhar FROM user_profile) as up,
             applicant as ap,
             (select * from user_kyc_log as ukli, login as li where ukli.user_id = li.user_id and ukli.user_id=${user_id}) as ukl
             where up.related_aadhar = ap.applicant_aadhar and up.related_aadhar = ukl.related_aadhar;`)

            return res.status(200).send(q1[0]);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err });
        }
    };


    return {
        // returning all the functions form the controller
        register,
        get,
        getAadharList,
        getPanList,
        getFnameAndAadhar,
        getComboBoxData,
        getCountOfKyc,
        insertBorrowerDetails,
        getUserProfileID,
        getProfileForProfileID,
        insertNewLoan,
        getPreSignedUrl,
        getPreSignedUrlForRetrieval,
        approveKYC,
        getAgentNameForKYC,
        terminateLoan,
        resubmitKYC,
        finishLoan,
        getAdminPanelData,
        createLead,
        getLeadForToken,
        getAllLeads,
        getLeadForUserId,
        getKYCData,
        deleteLead,
        getListOfProfileIdForUser,
        getAdminPanelDataForUser,
        getKYCDataForUserId
    };
};


// exporting the module 
module.exports = CarController
