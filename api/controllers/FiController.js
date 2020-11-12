/*
File DEscription: Creating a controller to perform API operations with database
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation 
*/
// Importing all the models from the model folder 
const FI = require('../models/Fi');



// importing the database confifurations from the datavbase folder 
const sequelize = require('../../config/database');
const UserProfile = require('../models/User-profile');
const Addressproof = require('../models/Addressproof');
const Financetype = require('../models/Financetype');
const Homeaccesibility = require('../models/Homeaccesibility');
const Housecondition = require('../models/Housecondition');
const Localitytype = require('../models/Localitytype');
const Noc = require('../models/NOC');
const Officeaccesibility = require('../models/Officeaccesibility');
const Officecondition = require('../models/Officecondition');
const Physicalcondition = require('../models/Physicalcondition');
const Ridequality = require('../models/Ridequality');
const Sourcetype = require('../models/Sourcetype');


const AWS = require('aws-sdk');
const Borrowerappearance = require('../models/Borrowerappearance');
const KycApprovalPending = require('../models/Kyc_approval_pending');
const FiAssignedPending = require('../models/Fi_assigned_pending');
const FiSubmittedPending = require('../models/Fi_submitted_pending');
const FiApprovalPending = require('../models/Fi_approval_pending');
const DocumentCheckUploadPending = require('../models/Document_check_upload_pending');
const EmiSchedulePending = require('../models/Emi_schedule_pending');
const DocumentCheckApprovePending = require('../models/Document_check_approve_pending');
const EmiSchedule = require('../models/Emi_Schedule');
const s3 = new AWS.S3();


// Defining a controller
const FIController = () => {


  const register = async (req, res) => {


    try {
      const { body } = req;
      const result = await sequelize.transaction(async (t) => {
      
      await FI.create({
        'fi_answers': JSON.parse(body.fi_answers),
        'related_aadhar': body.related_aadhar,
        'related_pan': body.related_pan
      }, { transaction : t});

      const userProfile = await UserProfile.findOne({
        where: {
          'related_pan': body.related_pan
        }
      }, { transaction : t})
      let loan_number = 0;
      let counter = 0;
      for (loan of userProfile.details_json[userProfile.user_id].loans) {
        if (loan.__loan_id == body.__loan_id) {
          loan_number = counter
        }
        counter++;
      }
      const date = new Date();
      userProfile.details_json[userProfile.user_id].loans[loan_number].fi_data = body.fi_answers
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.status = true;
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.time_stamp = date.toLocaleString();
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.current_stage = 'fi_submitted';

      await UserProfile.update({
        'details_json': userProfile.details_json
      }, { where: { 'user_id': userProfile.user_id } }, { transaction : t })

      await FiApprovalPending.create({
        'profile_id': userProfile.user_id,
        'loan_id': req.body.__loan_id,
        'user_id': userProfile.details_json[userProfile.user_id].loans[loan_number].assigned_to.id
      }, { transaction : t})

      await FiSubmittedPending.destroy({
        where: {
          'profile_id': userProfile.user_id
        }
      }, { transaction : t})
      return res.status(200).json({ msg: 'Operation Successful' })
    })
    } catch (err) {
      console.log(err);
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  };

  const getComboBoxData = async (req, res) => {
    try {
    const result = await sequelize.transaction(async (t) => {
      const AddressproofModel = await Addressproof.findAll({}, { transaction : t});
      const FinancetypeModel = await Financetype.findAll({}, { transaction : t});
      const HomeaccessibilityModel = await Homeaccesibility.findAll({}, { transaction : t});
      const HouseconditionModel = await Housecondition.findAll({}, { transaction : t});
      const LocalitytypeModel = await Localitytype.findAll({}, { transaction : t});
      const NocModel = await Noc.findAll({}, { transaction : t});
      const OfficeaccesibilityModel = await Officeaccesibility.findAll({}, { transaction : t});
      const OfficeconditionModel = await Officecondition.findAll({}, { transaction : t});
      const PhysicalconditionModel = await Physicalcondition.findAll({}, { transaction : t});
      const RidequalityModel = await Ridequality.findAll({}, { transaction : t});
      const SourcetypeModel = await Sourcetype.findAll({}, { transaction : t});
      const BorrowerappearanceModel = await Borrowerappearance.findAll({}, { transaction : t})

      return res.status(200).json({
        AddressproofModel, BorrowerappearanceModel, FinancetypeModel, HomeaccessibilityModel, HouseconditionModel,
        LocalitytypeModel, NocModel, OfficeaccesibilityModel, OfficeconditionModel, PhysicalconditionModel,
        RidequalityModel, SourcetypeModel
      })
    })

    } catch (err) {
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  };

  const getPreSignedUrl = async (req, res) => {
    try {
      // console.log(JSON.parse(process.env.S3_BUCKET))
      const preSignedUrl = await s3.getSignedUrl('putObject', {
        Bucket: 'my-express-application-dev-s3bucket-18eh6dlfu6qih',
        Key: `FI/${req.query.loan_type}/${req.query.profile_id}/${req.query.__loan_id}/${req.query.filename}`, // File name could come from queryParameters
        Metadata: {}
      });

      return res.status(200).json(preSignedUrl)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getPreSignedUrlForRetrieval = async (req, res) => {
    try {
      // console.log(JSON.parse(process.env.S3_BUCKET))
      const preSignedUrl = await s3.getSignedUrl('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-18eh6dlfu6qih',
        Key: `FI/${req.query.loan_type}/${req.query.profile_id}/${req.query.__loan_id}/${req.query.filename}`, // File name could come from queryParameters
      });

      return res.status(200).json(preSignedUrl)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const assignTo = async (req, res) => {
    
    
    const user_id = req.body.user_id;
    const __loan_id = req.body.__loan_id;
    const name = req.body.name;
    const agent_id = req.body.agent_id;

    try {
     const result = await sequelize.transaction(async (t) => {

      const profile = await UserProfile.findOne({
        where: {
          user_id: user_id
        }
      }, { transaction : t});

      let counter = 0;
      let loanNumber = 0;
      for (let loan of profile.details_json[user_id].loans) {
        if (loan.__loan_id == __loan_id) {
          loanNumber = counter;
        }
        counter++;
      }
      const date = new Date()
      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.time_stamp = date.toLocaleString();
      profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'fi_assigned';
      profile.details_json[user_id].loans[loanNumber].assigned_to.name = name;
      profile.details_json[user_id].loans[loanNumber].assigned_to.id = agent_id;

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': user_id } }, { transaction : t})

      await FiSubmittedPending.create({
        'profile_id': user_id,
        'loan_id': __loan_id,
        'user_id': agent_id
      }, { transaction : t})

      await FiAssignedPending.destroy({
        where: {
          'profile_id': user_id
        }
      }, { transaction : t})

      return res.status(200).json({ msg: 'Operation Successful' });
    })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };


  const getAllPendingList = async (req, res) => {
    try {
    const result = await sequelize.transaction(async (t) => {

      const KycApprovalPendingModel = await KycApprovalPending.findAll({}, { transaction : t});
      const FiAssignedPendingModel = await FiAssignedPending.findAll({}, { transaction : t});
      const FiSubmittedPendingModel = await FiSubmittedPending.findAll({}, { transaction : t});
      const FiApprovalPendingModel = await FiApprovalPending.findAll({}, { transaction : t});
      const DocumentCheckUploadPendingModel = await DocumentCheckUploadPending.findAll({}, { transaction : t});
      const DocumentCheckApprovePendingModel = await DocumentCheckApprovePending.findAll({}, { transaction : t});
      const EmiSchedulePendingModel = await EmiSchedulePending.findAll({}, { transaction : t});

      return res.status(200).json({
        KycApprovalPendingModel, FiAssignedPendingModel, FiSubmittedPendingModel,
        FiApprovalPendingModel, DocumentCheckUploadPendingModel, DocumentCheckApprovePendingModel,
        EmiSchedulePendingModel
      });
    })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getPreSignedUrlDocument = async (req, res) => {
    try {
      // console.log(JSON.parse(process.env.S3_BUCKET))
      const preSignedUrl = await s3.getSignedUrl('putObject', {
        Bucket: 'my-express-application-dev-s3bucket-18eh6dlfu6qih',
        Key: `Document/${req.query.profile_id}/${req.query.filename}`, // File name could come from queryParameters
        Metadata: {}
      });

      return res.status(200).json(preSignedUrl)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getPreSignedUrlForRetrievalDocument = async (req, res) => {
    try {
      // console.log(JSON.parse(process.env.S3_BUCKET))
      const preSignedUrl = await s3.getSignedUrl('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-18eh6dlfu6qih',
        Key: `Document/${req.query.profile_id}/${req.query.filename}`, // File name could come from queryParameters
      });

      return res.status(200).json(preSignedUrl)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getFiSubmittedPendingForUser = async (req, res) => {
    const user_id = req.query.user_id
    try {
      
      const result = await sequelize.query(`SELECT fsp.profile_id, fsp.loan_id, applicant_firstname
      FROM public.fi_submitted_pending as fsp, (select user_id, applicant_firstname from user_profile, applicant where related_aadhar = applicant_aadhar) as d where d.user_id = fsp.profile_id and fsp.user_id = ${user_id};`)

      const FiSubmittedPendingModel = result[0]
      return res.status(200).json(FiSubmittedPendingModel)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getDocumentCheckUploadPendingForUser = async (req, res) => {
    const user_id = req.query.user_id
    try {
      const result = await sequelize.query(`SELECT fsp.profile_id, fsp.loan_id, applicant_firstname
      FROM public.document_check_upload_pending as fsp, (select user_id, applicant_firstname from user_profile, applicant where related_aadhar = applicant_aadhar) as d where d.user_id = fsp.profile_id and fsp.user_id = ${user_id};`)

      const DocumentCheckUploadPendingModel = result[0]

      return res.status(200).json(DocumentCheckUploadPendingModel)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const approveFI = async (req, res) => {
    const user_id = req.query.user_id;
    const __loan_id = req.query.__loan_id;
    const approve_status = req.query.approve_status;
    const remark = req.query.remark;

    try {
      const result = await sequelize.transaction(async (t) => {

      let profile = await UserProfile.findOne({
        where: {
          user_id: user_id
        }
      }, { transaction : t})
      let counter = 0;
      let loanNumber = 0;
      for (let loan of profile.details_json[user_id].loans) {
        if (loan.__loan_id == __loan_id) {
          loanNumber = counter;
        }
        counter++;
      }
      const date = new Date();
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.approve_status = approve_status;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.time_stamp = date.toLocaleString();
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.remark = remark;
      profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'fi_approval';

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': user_id } }, { transaction : t})

      if (approve_status === 'true') {
        await DocumentCheckUploadPending.create({
          'profile_id': user_id,
          'loan_id': __loan_id,
          'user_id': profile.details_json[user_id].loans[loanNumber].assigned_to.id
        }, { transaction : t})

        await FiApprovalPending.destroy({
          where: {
            'profile_id': user_id,
          }
        }, { transaction : t})
      }


      return res.status(200).json({ msg: 'Operation Successful' })
    })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const createDocumentApprovePending = async (req, res) => {
    const user_id = req.query.user_id;
    const loan_id = req.query.loan_id;
    const profile_id = req.query.profile_id;

    try {
      const result = await sequelize.transaction(async (t) => {

      await DocumentCheckApprovePending.create({
        profile_id, user_id, loan_id
      }, { transaction : t})

      await DocumentCheckUploadPending.destroy({
        where: {
          profile_id
        }
      }, { transaction : t})
      return res.status(200).json({ msg: 'Operation Successful' })
    })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const createEMISchedule = async (req, res) => {
    const emi_schedule_profile_id = req.query.emi_schedule_profile_id;
    const emi_schedule_loan_id = req.query.emi_schedule_loan_id;
    const emi_schedule_loan_amount = parseInt(req.query.emi_schedule_loan_amount);
    const emi_schedule_interest_rate = parseInt(req.query.emi_schedule_interest_rate);
    const emi_schedule_loan_tenure = parseInt(req.query.emi_schedule_loan_tenure);
    const emi_schedule_start_date = req.query.emi_schedule_start_date;

    const user_id = emi_schedule_profile_id;

    const remark = req.query.remark;

    const emi_schedule_json_object = req.body;
    console.log({
      emi_schedule_profile_id, emi_schedule_loan_id, emi_schedule_loan_amount,
      emi_schedule_interest_rate, emi_schedule_loan_tenure, emi_schedule_start_date,
      emi_schedule_json_object
    });

    try {
      const result = await sequelize.transaction(async (t) => {

      await EmiSchedule.create({
        emi_schedule_profile_id, emi_schedule_loan_id, emi_schedule_loan_amount,
        emi_schedule_interest_rate, emi_schedule_loan_tenure, emi_schedule_start_date,
        emi_schedule_json_object
      }, { transaction : t});


      let profile = await UserProfile.findOne({
        where: {
          user_id: emi_schedule_profile_id
        }
      }, { transaction : t})

      console.log(profile)
      let counter = 0;
      let loanNumber = 0;
      for (let loan of profile.details_json[user_id].loans) {
        if (loan.__loan_id == emi_schedule_loan_id) {
          loanNumber = counter;
        }
        counter++;
      }
      const date = new Date();
      profile.details_json[user_id].loans[loanNumber].stages.emi_schedule.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.emi_schedule.time_stamp = date.toLocaleString();
      profile.details_json[user_id].loans[loanNumber].stages.emi_schedule.remark = remark;
      profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'emi_schedule';
      profile.details_json[user_id].loans[loanNumber].emi_schedule = emi_schedule_json_object;

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': emi_schedule_profile_id } }, { transaction : t})

      await EmiSchedulePending.destroy({
        where: {
          'profile_id': emi_schedule_profile_id
        }
      }, { transaction : t})

      return res.status(200).json({ msg: 'Operation Successful' })
    })


    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const getEMISchedule = async (req, res) => {
    const emi_schedule_profile_id = req.query.emi_schedule_profile_id;
    const emi_schedule_loan_id = req.query.emi_schedule_loan_id;

    try {
      const result = await sequelize.transaction(async (t) => {

      const schedule = await EmiSchedule.findOne({
        attributes: ['emi_schedule_json_object'],
        where: {
          emi_schedule_profile_id,
          emi_schedule_loan_id
        }
      }, { transaction : t});




      return res.status(200).send(schedule.emi_schedule_json_object)
    })


    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const approveDocument = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const user_id = req.query.user_id;
    const remark = req.query.remark;
    const status = req.query.status;

    try {
      const result = await sequelize.transaction(async (t) => {

      await DocumentCheckApprovePending.destroy({
        where: {
          profile_id, loan_id
        }
      }, { transaction : t});
      if (status === 'true') {
        let profile = await UserProfile.findOne({
          where: {
            user_id: profile_id
          }
        }, { transaction : t});

        let counter = 0;
        let loanNumber = 0;
        for (let loan of profile.details_json[profile_id].loans) {
          if (loan.__loan_id == loan_id) {
            loanNumber = counter;
          }
          counter++;
        }

        const date = new Date();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.status = true;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.time_stamp = date.toLocaleString();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.remark = remark;
        profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'document_check_approve';

        await UserProfile.update({
          'details_json': profile.details_json
        }, { where: { 'user_id': profile_id } }, { transaction : t})


        await EmiSchedulePending.create({
          profile_id, loan_id
        }, { transaction : t})
      }
      else if (status === 'false') {
        let profile = await UserProfile.findOne({
          where: {
            user_id: profile_id
          }
        }, { transaction : t});

        let counter = 0;
        let loanNumber = 0;
        for (let loan of profile.details_json[profile_id].loans) {
          if (loan.__loan_id == loan_id) {
            loanNumber = counter;
          }
          counter++;
        }

        const date = new Date();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.status = false;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.time_stamp = date.toLocaleString();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.remark = remark;
        profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'document_check_approve';

        await UserProfile.update({
          'details_json': profile.details_json
        }, { where: { 'user_id': profile_id } }, { transaction : t})

        await DocumentCheckUploadPending.create({
          profile_id, loan_id, user_id
        }, { transaction : t})
      } else {
        return res.status(400).send('Incorrect status')
      }

      return res.status(200).send('Operation Successfull')
    })


    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };



  return {
    // returning all the functions form the controller
    register,
    getComboBoxData,
    getPreSignedUrl,
    assignTo,
    getAllPendingList,
    getPreSignedUrlForRetrieval,
    getPreSignedUrlDocument,
    getPreSignedUrlForRetrievalDocument,
    getFiSubmittedPendingForUser,
    getDocumentCheckUploadPendingForUser,
    approveFI,
    createDocumentApprovePending,
    createEMISchedule,
    getEMISchedule,
    approveDocument
  };
};







// exporting the module 
module.exports = FIController
