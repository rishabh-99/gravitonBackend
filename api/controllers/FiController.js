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
const s3 = new AWS.S3();


// Defining a controller
const FIController = () => {


  const register = async (req, res) => {


    try {
      const { body } = req;
      await FI.create({
        'fi_answers': JSON.parse(body.fi_answers),
        'related_aadhar': body.related_aadhar,
        'related_pan': body.related_pan
      });

      const userProfile = await UserProfile.findOne({
        where: {
          'related_pan': body.related_pan
        }
      })
      let loan_number = 0;
      let counter = 0;
      for (loan of userProfile.details_json[userProfile.user_id].loans) {
        if (loan.__loan_id == body.__loan_id) {
          loan_number = counter
        }
        counter++;
      }

      userProfile.details_json[userProfile.user_id].loans[loan_number].fi_data = body.fi_answers
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.status = true;
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.time_stamp = new Date();

      await UserProfile.update({
        'details_json': userProfile.details_json
      }, { where: { 'user_id': userProfile.user_id } })

      await FiApprovalPending.create({
        'profile_id': userProfile.user_id,
        'loan_id': req.body.__loan_id,
        'user_id': userProfile.details_json[userProfile.user_id].loans[loan_number].assigned_to.id
      })
      return res.status(200).json({ msg: 'Operation Successful' })
    } catch (err) {
      console.log(err);
      // 500 error returns "internal server error"
      return res.status(500).json({ msg: err });
    }
  };

  const getComboBoxData = async (req, res) => {
    try {
      const AddressproofModel = await Addressproof.findAll();
      const FinancetypeModel = await Financetype.findAll();
      const HomeaccessibilityModel = await Homeaccesibility.findAll();
      const HouseconditionModel = await Housecondition.findAll();
      const LocalitytypeModel = await Localitytype.findAll();
      const NocModel = await Noc.findAll();
      const OfficeaccesibilityModel = await Officeaccesibility.findAll();
      const OfficeconditionModel = await Officecondition.findAll();
      const PhysicalconditionModel = await Physicalcondition.findAll();
      const RidequalityModel = await Ridequality.findAll();
      const SourcetypeModel = await Sourcetype.findAll();
      const BorrowerappearanceModel = await Borrowerappearance.findAll()

      return res.status(200).json({
        AddressproofModel, BorrowerappearanceModel, FinancetypeModel, HomeaccessibilityModel, HouseconditionModel,
        LocalitytypeModel, NocModel, OfficeaccesibilityModel, OfficeconditionModel, PhysicalconditionModel,
        RidequalityModel, SourcetypeModel
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
      const profile = await UserProfile.findOne({
        where: {
          user_id: user_id
        }
      });

      let counter = 0;
      let loanNumber = 0;
      for (let loan of profile.details_json[user_id].loans) {
        if (loan.__loan_id == __loan_id) {
          loanNumber = counter;
        }
        counter++;
      }

      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.time_stamp = new Date();
      profile.details_json[user_id].loans[loanNumber].assigned_to.name = name;
      profile.details_json[user_id].loans[loanNumber].assigned_to.id = agent_id;

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': user_id } })

      await FiSubmittedPending.create({
        'profile_id': user_id,
        'loan_id': __loan_id,
        'user_id': agent_id
      })

      return res.status(200).json({ msg: 'Operation Successful' });
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };


  const getAllPendingList = async (req, res) => {
    try {

      const KycApprovalPendingModel = await KycApprovalPending.findAll();
      const FiAssignedPendingModel = await FiAssignedPending.findAll();
      const FiSubmittedPendingModel = await FiSubmittedPending.findAll();
      const FiApprovalPendingModel = await FiApprovalPending.findAll();
      const DocumentCheckUploadPendingModel = await DocumentCheckUploadPending.findAll();
      const DocumentCheckApprovePendingModel = await DocumentCheckApprovePending.findAll();
      const EmiSchedulePendingModel = await EmiSchedulePending.findAll();

      return res.status(200).json({
        KycApprovalPendingModel, FiAssignedPendingModel, FiSubmittedPendingModel,
        FiApprovalPendingModel, DocumentCheckUploadPendingModel, DocumentCheckApprovePendingModel,
        EmiSchedulePendingModel
      });
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
      const FiSubmittedPendingModel = await FiSubmittedPending.findAll({
        where: {
          user_id
        },
        attributes: ['profile_id', 'loan_id']
      })

      return res.status(200).json(FiSubmittedPendingModel)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const getDocumentCheckUploadPendingForUser = async (req, res) => {
    const user_id = req.query.user_id
    try {
      const DocumentCheckUploadPendingModel = await DocumentCheckUploadPending.findAll({
        where: {
          user_id
        },
        attributes: ['profile_id', 'loan_id']
      })

      return res.status(200).json(DocumentCheckUploadPendingModel)
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const approveFI = async (req, res) => {
    const user_id = req.query.user_id;
    const __loan_id = req.query.__loan_id;
    const approve_status = req.query.approve_status;

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

      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.approve_status = approve_status;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.time_stamp = new Date();

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': user_id } })

      if (approve_status === 'true') {
        await DocumentCheckUploadPending.create({
          'profile_id': user_id,
          'loan_id': __loan_id,
          'user_id': profile.details_json[user_id].loans[loanNumber].assigned_to.id
        })
      }


      return res.status(200).json({ msg: 'Operation Successful' })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const createDocumentApprovePending = async (req, res) => {
    const user_id = req.query.user_id;
    const loan_id = req.query.loan_id;
    const profile_id = req.query.profile_id;

    try {
      await DocumentCheckApprovePending.create({
        profile_id,user_id, loan_id
      })
      return res.status(200).json({msg: 'Operation Successful'})
    } catch (err) {
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
    createDocumentApprovePending
  };
};







// exporting the module 
module.exports = FIController
