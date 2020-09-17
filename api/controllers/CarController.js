const Document = require('../models/Document');
const Gurantor = require('../models/Gurantor');
const Applicant = require('../models/Applicant');
const Account = require('../models/Account');
const Loan = require('../models/Loan');
const sequelize = require('../../config/database');

const CarController = () => {
    const register = async (req, res) => {
        const { body } = req;
        try {
            // Permissions ko obj me convert krna h
            const result = await sequelize.transaction(async (t) => {
                const document = await Document.create({
                    'document_pan': body.documentModel.document_pan,
                    'document_aadhar': body.documentModel.document_aadhar,
                    'document_optional': body.documentModel.document_optional,
                    'document_cibil': body.documentModel.document_cibil,
                    'document_remark': body.documentModel.document_remark,
                    'document_id': body.documentModel.document_id,
                    'progress_id': body.documentModel.progress_id
                }, { transaction: t });

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

                    loans.push(
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

                return { document, gurantor, applicant, account, loans };
            });
            console.log({ result })
            return res.status(200).json({ msg: 'CAR created Successfully' })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err });
        }
    };

    const get = async (req, res) => {
        // const { body } = req;
        const aadhar = req.query.aadhar
        try {

            const documentModel = await Document.findAll({
                where: {
                    'document_aadhar': aadhar
                }
            });

            const gurantorModel = await Gurantor.findAll({
                where: {
                    'gurantor_realtedaadhar': aadhar
                }
            });

            const applicantModel = await Applicant.findAll({
                where: {
                    'applicant_aadhar': aadhar
                }
            });

            const accountModel = await Account.findAll({
                where: {
                    'account_realtedaadhar': aadhar
                }
            });
            const loanModel = await Loan.findAll({
                where: {
                    'account_realtedaadhar': aadhar
                }
            })

            // return {document, gurantor, applicant, account, loans};

            return res.status(200).json({ documentModel, gurantorModel, applicantModel, accountModel, loanModel });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err });
        }
    };

    const getAadharList = async (req, res) => {
        try {
            const Aadhar = await Document.findAll({
                attributes: ['document_aadhar']
            })
                .then(document => document.map(document => document.document_pan));
            console.log(Aadhar)
            return res.status(200).json(Aadhar)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getPanList = async (req, res) => {
        try {
            const Pan = await Document.findAll({
                attributes: ['document_pan'],

            })
                .then(document => document.map(document => document.document_pan));
            console.log(typeof(Pan))
            res.status(200).send(Pan)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    const getFnameAndAadhar = async (req, res) => {
        try {
            const NameWithAadhar = await Applicant.findAll({
                attributes: ['applicant_aadhar', 'applicant_firstname'],

            })
                .then(applicant => applicant.map(applicant => `${applicant.applicant_aadhar} : ${applicant.applicant_firstname}`));
            console.log(NameWithAadhar)
            res.status(200).send(NameWithAadhar)
        } catch (err) {
            return res.status(500).json({ msg: err });
        }
    };

    return {
        register,
        get,
        getAadharList,
        getPanList,
        getFnameAndAadhar
    };
};

module.exports = CarController;
