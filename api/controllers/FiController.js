/*
File DEscription: Creating a controller to perform API operations with database
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation 
*/
// Importing all the models from the model folder 
const FI = require('../models/Fi');
const pdfmake = require('pdfmake')
const fs = require('fs');
const moment = require('moment')
const { parse, stringify } = require('flatted');

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
      const date = new Date();
      userProfile.details_json[userProfile.user_id].loans[loan_number].fi_data = body.fi_answers
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.status = true;
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.fi_submitted.time_stamp = date.toLocaleString();
      userProfile.details_json[userProfile.user_id].loans[loan_number].stages.current_stage = 'fi_submitted';

      await UserProfile.update({
        'details_json': userProfile.details_json
      }, { where: { 'user_id': userProfile.user_id } })

      await FiApprovalPending.create({
        'profile_id': userProfile.user_id,
        'loan_id': req.body.__loan_id,
        'user_id': userProfile.details_json[userProfile.user_id].loans[loan_number].assigned_to.id
      })

      await FiSubmittedPending.destroy({
        where: {
          'profile_id': userProfile.user_id
        }
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
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
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
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
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
      const date = new Date()
      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_assigned.time_stamp = date.toLocaleString();
      profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'fi_assigned';
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

      await FiAssignedPending.destroy({
        where: {
          'profile_id': user_id
        }
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
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
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
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
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
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.status = true;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.approve_status = approve_status;
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.time_stamp = date.toLocaleString();
      profile.details_json[user_id].loans[loanNumber].stages.fi_approval.remark = remark;
      profile.details_json[user_id].loans[loanNumber].stages.current_stage = 'fi_approval';

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': user_id } })

      if (approve_status === 'true') {
        await DocumentCheckUploadPending.create({
          'profile_id': user_id,
          'loan_id': __loan_id,
          'user_id': profile.details_json[user_id].loans[loanNumber].assigned_to.id
        })

        await FiApprovalPending.destroy({
          where: {
            'profile_id': user_id,
          }
        })
      }


      return res.status(200).json({ msg: 'Operation Successful' })
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  };

  const createDocumentApprovePending = async (req, res) => {
    const user_id = parseInt(req.query.user_id);
    const loan_id = req.query.loan_id;
    const profile_id = req.query.profile_id;
    const documentJSON = req.body;
    try {


      let profile = await UserProfile.findOne({
        where: {
          user_id: profile_id
        }
      });

      console.log({ profile })
      console.log(profile.details_json)
      let counter = 0;
      let loanNumber = 0;
      for (let loan of profile.details_json[profile_id].loans) {
        if (loan.__loan_id == loan_id) {
          loanNumber = counter;
        }
        counter++;
      }
      const date = new Date();
      profile.details_json[profile_id].loans[loanNumber].documentJSON = documentJSON;
      profile.details_json[profile_id].loans[loanNumber].stages.document_check_upload.status = true;
      profile.details_json[profile_id].loans[loanNumber].stages.document_check_upload.time_stamp = date.toLocaleString();
      profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'document_check_upload';

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': profile_id } });


      await DocumentCheckApprovePending.create({
        profile_id, user_id, loan_id
      })

      await DocumentCheckUploadPending.destroy({
        where: {
          profile_id, loan_id, user_id
        }
      })
      return res.status(200).json({ msg: 'Operation Successful' })
    } catch (err) {
      console.log(err)
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


    try {
      await EmiSchedule.create({
        emi_schedule_profile_id, emi_schedule_loan_id, emi_schedule_loan_amount,
        emi_schedule_interest_rate, emi_schedule_loan_tenure, emi_schedule_start_date,
        emi_schedule_json_object
      });


      let profile = await UserProfile.findOne({
        where: {
          user_id: emi_schedule_profile_id
        }
      })

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
      }, { where: { 'user_id': emi_schedule_profile_id } })

      await EmiSchedulePending.destroy({
        where: {
          'profile_id': emi_schedule_profile_id
        }
      })

      return res.status(200).json({ msg: 'Operation Successful' })


    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const getEMISchedule = async (req, res) => {
    const emi_schedule_profile_id = req.query.emi_schedule_profile_id;
    const emi_schedule_loan_id = req.query.emi_schedule_loan_id;

    try {
      const schedule = await EmiSchedule.findOne({
        attributes: ['emi_schedule_json_object'],
        where: {
          emi_schedule_profile_id,
          emi_schedule_loan_id
        }
      });




      return res.status(200).send(schedule.emi_schedule_json_object)


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
    const approve_status = req.query.approve_status;

    try {
      await DocumentCheckApprovePending.destroy({
        where: {
          profile_id, loan_id
        }
      });
      if (approve_status === 'true') {
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
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.status = true;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.approve_status = approve_status;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.time_stamp = date.toLocaleString();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.remark = remark;
        profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'document_check_approve';

        await UserProfile.update({
          'details_json': profile.details_json
        }, { where: { 'user_id': profile_id } })


        await EmiSchedulePending.create({
          profile_id, loan_id
        })
      } else if (approve_status === 'false') {
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
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.status = true;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.approve_status = approve_status;
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.time_stamp = date.toLocaleString();
        profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.remark = remark;
        profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'document_check_approve';

        await UserProfile.update({
          'details_json': profile.details_json
        }, { where: { 'user_id': profile_id } })

      } else {
        return res.status(400).send('Incorrect status')
      }

      return res.status(200).send('Operation Successfull')


    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const resubmitDocument = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const user_id = req.query.user_id;
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
      profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.status = false;
      profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.time_stamp = date.toLocaleString();
      profile.details_json[profile_id].loans[loanNumber].stages.document_check_approve.remark = remark;
      profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'fi_approval';

      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': profile_id } })

      await DocumentCheckUploadPending.create({
        profile_id, loan_id, user_id
      })

      await DocumentCheckApprovePending.destroy({
        where: { profile_id, loan_id, user_id }
      })

      return res.status(200).json({ msg: 'Operation Successfull' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const resubmitFI = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const remark = req.query.remark;
    const user_id = parseInt(req.query.user_id);

    console.log({ profile_id, loan_id, remark, user_id })

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
      profile.details_json[profile_id].loans[loanNumber].stages.fi_submitted.status = false;
      profile.details_json[profile_id].loans[loanNumber].stages.fi_submitted.time_stamp = date.toLocaleString();
      profile.details_json[profile_id].loans[loanNumber].stages.fi_submitted.remark = remark;
      profile.details_json[profile_id].loans[loanNumber].stages.current_stage = 'fi_assigned';


      await UserProfile.update({
        'details_json': profile.details_json
      }, { where: { 'user_id': profile_id } })

      await FiApprovalPending.destroy({
        where: {
          profile_id, loan_id
        }
      })

      await FiSubmittedPending.create({
        profile_id, loan_id, user_id
      })

      return res.status(200).json({ msg: 'Operation Successfull' })

    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const makePdf = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const filename = req.query.filename;
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
      let schedules = profile.details_json[profile_id].loans[loanNumber].emi_schedule.EmiSchedules

      var fonts = {
        Courier: {
          normal: 'fonts/cour.ttf',
          bold: 'fonts/courbd.ttf',
          italics: 'fonts/couri.ttf',
          bolditalics: 'fonts/courbi.ttf'
        },
        Glegoo: {
          normal: 'fonts/Glegoo-Regular.ttf',
          bold: 'fonts/Glegoo-Bold.ttf',
          italics: 'fonts/Glegoo-Regular.ttf',
          bolditalics: 'fonts/Glegoo-Regular.ttf'
        }
      };
      var printer = new pdfmake(fonts);


      var dd = {
        pageMargins: [40, 140, 40, 150],
        pageSize: 'A4',
        header: {

          columns: [
            {
              stack: ['\n',
                {
                  text: 'Navya Enterprises', style: 'header'
                },
                {
                  text: 'Prop Neel Sarin', style: 'content'
                },
                {
                  text: '70/144 Patel Marg, Mansrovar Jaipur', style: 'content'
                },
              ]
            }

          ],
        },
        footer: function (currentPage, pageCount) {
          if (currentPage === pageCount) {
            return {
              columns: [
                { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 110, 0, 0] },

              ]
            }
          }
          return {
            columns: [
              { text: 'Signature of the Applicant', alignment: 'left', margin: [35, 50, -100, 0] },
              { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 110, 0, 0], alignment: 'center' },
              { text: 'Date', alignment: 'right', margin: [0, 50, 35, 0] }
            ]
          }
        },
        content: [
          {
            style: 'tableExample',
            table: {
              dontBreakRows: true,
              widths: [
                150, '*', '*'
              ],
              heights: 20,
              body: [
                [
                  {
                    text: 'Name of borrower', style: 'tableHeader'
                  },
                  {
                    text: `${profile.details_json[profile_id].kyc.CarJSON.applicantModel.applicant_firstname} ${profile.details_json[profile_id].kyc.CarJSON.applicantModel.applicant_lastname}`, colSpan: 2, style: 'tableContent'
                  },
                  {}
                ],
                [
                  {
                    text: 'Address', style: 'tableHeader'
                  },
                  {
                    text: `${profile.details_json[profile_id].kyc.CarJSON.applicantModel.applicant_currentaddress}`, colSpan: 2, style: 'tableContent'
                  },
                  {}
                ],
                [
                  {
                    text: 'Office Address', style: 'tableHeader'
                  },
                  {
                    text: `${profile.details_json[profile_id].kyc.CarJSON.applicantModel.applicant_officeaddress}`, colSpan: 2, style: 'tableContent'
                  },
                  {}
                ],
                [
                  {
                    text: '', style: 'tableHeader'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Mobile', style: 'tableHeader'
                  },
                  {
                    text: 'Loan Amount', style: 'tableHeader'
                  },
                  {
                    text: 'EMI Amount', style: 'tableHeader'
                  }
                ],
                [
                  {
                    text: `${profile.details_json[profile_id].kyc.CarJSON.applicantModel.applicant_mobile}`, style: 'tableContent'
                  },
                  {
                    text: `${profile.details_json[profile_id].loans[loanNumber].emi_schedule.TotalAmount}`, style: 'tableContent'
                  },
                  {
                    text: `${profile.details_json[profile_id].loans[loanNumber].emi_schedule.MonthlyEmi}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Loan Account Number', style: 'tableHeader'
                  },
                  {
                    text: `${profile_id}`, colSpan: 2, style: 'tableContent'
                  },
                  {}
                ],
                [
                  {
                    text: 'Loan EMI Schedule', style: 'tableHeader', colSpan: 3
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'EMI Counter', style: 'tableHeader'
                  },
                  {
                    text: 'Date', style: 'tableHeader'
                  },
                  {
                    text: 'EMI Amount', style: 'tableHeader'
                  }
                ],
              ]
            },
          },
          '\n',
          '\n',
          '\n',
          '\n',
          {
            unbreakable: true,
            stack: [
              { text: 'Terms & Condition', style: 'leftHeader' },
              {
                ol: [
                  { text: 'I understand the terms & conditions of the loan.', margin: [0, 5, 0, 5] },
                  { text: 'I will deposit the EMI before or as per the Schedule mentioned above.', margin: [0, 0, 0, 5] },
                  { text: 'Cheque Bounce Charges per presentation is ₹400.', margin: [0, 0, 0, 5] },
                  { text: 'EMI/ Cash Pick up charges are applicable and are ₹350.', margin: [0, 0, 0, 5] },
                  { text: 'Late Payment Fee is applicable and is ₹300.', margin: [0, 0, 0, 5] },
                  { text: 'No Objection certificate fee is ₹350.', margin: [0, 0, 0, 5] },
                ],
                style: 'leftData'
              },
              '\n',
              '\n',
              { text: 'नियम एवं शर्तें', style: 'leftHeaderHindi' },
              {
                ol: [
                  { text: 'मैं ऋण के नियमों और शर्तों को समझता हूं।', margin: [0, 5, 0, 5] },
                  { text: 'मैं ऊपर उल्लिखित अनुसूची के अनुसार या पहले ईएमआई जमा करूंगा।', margin: [0, 0, 0, 5] },
                  { text: 'चेक बाउंस शुल्क आरएस ₹400 प्रति प्रस्तुति हैं।', margin: [0, 0, 0, 5] },
                  { text: 'कैश ईएमआई या कैश पिकअप शुल्क लागू हैं और ₹400 हैं।', margin: [0, 0, 0, 5] },
                  { text: 'लेट पेमेंट शुल्क लागू है और ₹300 है।', margin: [0, 0, 0, 5] },
                  { text: '₹350 के शुल्क का भुगतान करने के बाद नो ऑब्जेक्शन सर्टिफिकेट जारी किया जाएगा।', margin: [0, 0, 0, 5] },
                ],
                style: 'leftDataHindi'
              },
              '\n',
              '\n',
              '\n',
              '\n',
              '\n',
              '\n',

              {

                columns: [
                  {
                    text: 'Signature of the Applicant', alignment: 'left'
                  },
                  { text: 'Date', alignment: 'right' }
                ]
              },
            ]
          }
        ],
        styles: {
          leftHeader: {
            alignment: 'left',
            fontSize: 13,
            bold: true
          },
          leftData: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.5,
            margin: [15, 0, 0, 0]
          },
          leftHeaderHindi: {
            alignment: 'left',
            fontSize: 10,
            bold: true,
            font: 'Glegoo'
          },
          leftDataHindi: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.15,
            margin: [15, 0, 0, 0],
            font: 'Glegoo'
          },
          header: {
            fontSize: 28,
            // 			bold: true,
            margin: [
              0,
              0,
              0,
              10
            ]
          },
          content: {
            fontSize: 12,
            margin: [
              0,
              0,
              0,
              4
            ]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [
              0,
              10,
              0,
              5
            ]
          },
          tableExample: {
            margin: [
              0,
              5,
              0,
              5
            ],
            width: 400
          },
          tableHeader: {
            bold: true,
            fontSize: 8.5,
            color: 'black',
            margin: [
              0,
              5
            ]
          },
          tableContent: {
            fontSize: 9,
            margin: [
              0,
              5
            ]
          }
        },
        defaultStyle: {
          alignment: 'center',
          font: 'Courier'
        }
      }

      for (let schedule of schedules) {
        dd.content[0].table.body.push([
          {
            text: `${schedule.Id}`, style: 'tableContent'
          },
          {
            text: `${schedule.Date}`, style: 'tableContent'
          },
          {
            text: `${schedule['EMI']}`, style: 'tableContent'
          }
        ])

      }
      const pdfBuffer = await new Promise(resolve => {
        const pdfMake = printer.createPdfKitDocument(dd);

        let chunks = [];

        pdfMake.on("data", chunk => {
          chunks.push(chunk);
        });
        pdfMake.on("end", () => {
          const result = Buffer.concat(chunks);
          var now = new Date();
          now.setMinutes(now.getMinutes() + 30); // timestamp
          now = new Date(now); // Date object
          s3.putObject(
            {
              Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
              Key: `EMI/${profile_id}/${filename}`,
              Body: result,
              Expires: now
            },
            function (resp, d) {
              resolve(result)
            }
          )
        });


        pdfMake.end();
      })

      const a = pdfBuffer


      const preSignedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
        Key: `EMI/${profile_id}/${filename}`, // File name could come from queryParameters
      });


      return res.status(200).json(preSignedUrl)

    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const makePdfForPersonalLoan = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const filename = req.query.filename;
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

      let fi_data = JSON.parse(profile.details_json[profile_id].loans[loanNumber].fi_data)

      var fonts = {
        Courier: {
          normal: 'fonts/cour.ttf',
          bold: 'fonts/courbd.ttf',
          italics: 'fonts/couri.ttf',
          bolditalics: 'fonts/courbi.ttf'
        },
        Glegoo: {
          normal: 'fonts/Glegoo-Regular.ttf',
          bold: 'fonts/Glegoo-Bold.ttf',
          italics: 'fonts/Glegoo-Regular.ttf',
          bolditalics: 'fonts/Glegoo-Regular.ttf'
        }
      };
      var printer = new pdfmake(fonts);


      var dd = {
        pageMargins: [40, 110, 40, 60],
        pageSize: 'A4',
        header: {

          columns: [
            {
              stack: ['\n',
                {
                  text: 'Navya Enterprises', style: 'header'
                },
                {
                  text: 'Prop Neel Sarin', style: 'content'
                },
                {
                  text: '70/144 Patel Marg, Mansrovar Jaipur', style: 'content'
                },
              ]
            }

          ],
        },
        footer: function (currentPage, pageCount) {

          return {
            columns: [
              { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 0, 0, 0] },

            ]
          }
        },
        content: [
          {
            columns: [
              {
                text: 'Field Investigation Form', style: 'leftHeader', align: 'left'
              },
              {
                text: `Account Number- ${profile_id}`, style: 'leftHeader', align: 'right'
              }
            ]
          },
          {
            text: 'Personal Loan', style: 'leftHeader'
          },
          '\n',
          {
            style: 'tableExample',
            table: {
              dontBreakRows: true,
              widths: [
                105, 135, 105, 135
              ],
              heights: 20,
              body: [
                [
                  {
                    text: 'General Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Full Name', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.GeneralDetails.FullName}`, style: 'tableContent'
                  },
                  {
                    text: 'Date of Creation', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.GeneralDetails.Dob}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Loan Amount', style: 'tableHeader'
                  },
                  {
                    text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.GeneralDetails.LoanAmount)}`, style: 'tableContent'
                  },
                  {
                    text: 'Mobile Number', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.GeneralDetails.MobileNumber}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Residence Investigation Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Residence Address', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.HouseAddress}`, colSpan: 3, style: 'tableContent'
                  },
                  {}, {}
                ],
                [
                  {
                    text: 'Residence Landmark', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.HouseLandmark}`, colSpan: 3, style: 'tableContent'
                  },
                  {}, {}
                ],
                [
                  {
                    text: 'Residence Accessibility', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.HomeAccesibility}`, style: 'tableContent'
                  },
                  {
                    text: 'Residence Condition', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.HouseConndition}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Residence Duration', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.ResidenceDuration}`, style: 'tableContent'
                  },
                  {
                    text: 'Address Proof', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.AddressProof}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Borrower Apprearance', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.BorrowerAppearence}`, style: 'tableContent'
                  },
                  {
                    text: 'Locality Type', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.LocalityType}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Total Family Members', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.TotalFamilyNumbers}`, style: 'tableContent'
                  },
                  {
                    text: 'Earning Members', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.EarningMembers}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Nearest Branch', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.NearestBranch}`, style: 'tableContent'
                  },
                  {
                    text: 'Acquaintance Relationship', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.AcquaintanceRelationship}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Acquaintance Name', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.AcquaintanceName}`, style: 'tableContent'
                  },
                  {
                    text: 'Acquaintance Phone', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.ResidenceInvestigationData.AcquaintancePhone}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Workplace Investigation Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Employer Name', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.EmployerName}`, colSpan: 3, style: 'tableContent'
                  }, {}, {}
                ],
                [
                  {
                    text: 'Office Address', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.OfficeAddress}`, colSpan: 3, style: 'tableContent'
                  }, {}, {}
                ],
                [
                  {
                    text: 'Office Landmark', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.OfficeLandmark}`, colSpan: 3, style: 'tableContent'
                  }, {}, {}
                ],
                [
                  {
                    text: 'Designation', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.Designation}`, style: 'tableContent'
                  },
                  {
                    text: 'Job Duration', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.JobDuration}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Inhand Salary', style: 'tableHeader'
                  },
                  {
                    text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.WorkplaceInvestigationData.InHandSalary)}`, style: 'tableContent'
                  },
                  {
                    text: 'Office Accessibility', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.OfficeAccesibility}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Office Condition', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.OfficeCondition}`, colSpan: 3, style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableHeader'
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Remarks', style: 'tableHeader'
                  },
                  {
                    text: `${fi_data.WorkplaceInvestigationData.Remarks}`, colSpan: 3, style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableHeader'
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ]
              ]
            },
          }
        ],
        styles: {
          leftHeader: {
            alignment: 'left',
            fontSize: 13,
            bold: true
          },
          leftData: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.5,
            margin: [15, 0, 0, 0]
          },
          leftHeaderHindi: {
            alignment: 'left',
            fontSize: 10,
            bold: true,
            font: 'Glegoo'
          },
          leftDataHindi: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.15,
            margin: [15, 0, 0, 0],
            font: 'Glegoo'
          },
          header: {
            fontSize: 28,
            // 			bold: true,
            margin: [
              0,
              0,
              0,
              10
            ]
          },
          content: {
            fontSize: 12,
            margin: [
              0,
              0,
              0,
              4
            ]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [
              0,
              10,
              0,
              5
            ]
          },
          tableExample: {
            margin: [
              0,
              5,
              0,
              5
            ],
            width: 400
          },
          tableHeader: {
            bold: true,
            fontSize: 8.5,
            color: 'black',
            margin: [
              0,
              5
            ]
          },
          tableContent: {
            fontSize: 9,
            margin: [
              0,
              5
            ]
          }
        },
        defaultStyle: {
          alignment: 'center',
          font: 'Courier'
        }
      }


      const pdfBuffer = await new Promise(resolve => {
        const pdfMake = printer.createPdfKitDocument(dd);

        let chunks = [];

        pdfMake.on("data", chunk => {
          chunks.push(chunk);
        });
        pdfMake.on("end", () => {
          const result = Buffer.concat(chunks);
          var now = new Date();
          now.setMinutes(now.getMinutes() + 30); // timestamp
          now = new Date(now); // Date object
          s3.putObject(
            {
              Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
              Key: `PersonalLoan/${profile_id}/${filename}`,
              Body: result,
              Expires: now
            },
            function (resp, d) {
              resolve(result)
            }
          )
        });


        pdfMake.end();
      })

      const a = pdfBuffer


      const preSignedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
        Key: `PersonalLoan/${profile_id}/${filename}`, // File name could come from queryParameters
      });


      return res.status(200).json(preSignedUrl)

    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const makePdfForAutoLoan = async (req, res) => {
    const profile_id = req.query.profile_id;
    const loan_id = req.query.loan_id;
    const filename = req.query.filename;
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

      let fi_data = JSON.parse(profile.details_json[profile_id].loans[loanNumber].fi_data)

      var fonts = {
        Courier: {
          normal: 'fonts/cour.ttf',
          bold: 'fonts/courbd.ttf',
          italics: 'fonts/couri.ttf',
          bolditalics: 'fonts/courbi.ttf'
        },
        Glegoo: {
          normal: 'fonts/Glegoo-Regular.ttf',
          bold: 'fonts/Glegoo-Bold.ttf',
          italics: 'fonts/Glegoo-Regular.ttf',
          bolditalics: 'fonts/Glegoo-Regular.ttf'
        }
      };
      var printer = new pdfmake(fonts);

      if (fi_data.VehicleInvestigationData.FinanceType !== 'Cash') {
        var dd = {
          pageMargins: [40, 120, 40, 60],
          pageSize: 'A4',
          header: {

            columns: [
              {
                stack: ['\n',
                  {
                    text: 'Navya Enterprises', style: 'header'
                  },
                  {
                    text: 'Prop Neel Sarin', style: 'content'
                  },
                  {
                    text: '70/144 Patel Marg, Mansrovar Jaipur', style: 'content'
                  },
                ]
              }

            ],
          },
          footer: function (currentPage, pageCount) {

            return {
              columns: [
                { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 20, 0, 0] },

              ]
            }
          },
          content: [
            {
              columns: [
                {
                  text: 'Field Investigation Form', style: 'leftHeader', align: 'left'
                },
                {
                  text: `Account Number- ${profile_id}`, style: 'leftHeader', align: 'right'
                }
              ]
            },
            {
              text: 'Auto Loan', style: 'leftHeader'
            },
            '\n',
            {
              style: 'tableExample',
              table: {
                dontBreakRows: true,
                widths: [
                  105, 135, 105, 135
                ],
                heights: 20,
                body: [
                  [
                    {
                      text: 'General Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Full Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.FullName}`, style: 'tableContent'
                    },
                    {
                      text: 'Date of Creation', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.Dob}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Loan Amount', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.GeneralDetails.LoanAmount)}`, style: 'tableContent'
                    },
                    {
                      text: 'Mobile Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.MobileNumber}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Residence Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Residence Address', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseAddress}`, colSpan: 3, style: 'tableContent'
                    },
                    {}, {}
                  ],
                  [
                    {
                      text: 'Residence Landmark', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseLandmark}`, colSpan: 3, style: 'tableContent'
                    },
                    {}, {}
                  ],
                  [
                    {
                      text: 'Residence Accessibility', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HomeAccesibility}`, style: 'tableContent'
                    },
                    {
                      text: 'Residence Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseConndition}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Locality Type', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.LocalityType}`, style: 'tableContent'
                    },
                    {
                      text: 'Address Proof', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AddressProof}`, style: 'tableContent'
                    }
                  ],

                  [
                    {
                      text: 'Total Family Members', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.TotalFamilyNumbers}`, style: 'tableContent'
                    },
                    {
                      text: 'Earning Members', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.EarningMembers}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Acquaintance Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AcquaintanceName}`, style: 'tableContent'
                    },
                    {
                      text: 'Acquaintance Phone', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AcquaintancePhone}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Workplace Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Employer Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.EmployerName}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Office Address', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeAddress}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Office Landmark', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeLandmark}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Designation', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.Designation}`, style: 'tableContent'
                    },
                    {
                      text: 'Job Duration', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.JobDuration}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Inhand Salary', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.WorkplaceInvestigationData.InHandSalary)}`, style: 'tableContent'
                    },
                    {
                      text: 'Office Accessibility', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeAccesibility}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Office Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeCondition}`, colSpan: 3, style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableHeader'
                    },
                    {
                      text: ``, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleNumber}`, style: 'tableContent'
                    },
                    {
                      text: 'Vehicle Brand', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleBrand}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Model', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleModel}`, style: 'tableContent'
                    },
                    {
                      text: 'Odometer Reading', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.OdometerReading}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Chassis Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.ChasisNumber}`, style: 'tableContent'
                    },
                    {
                      text: 'Engine Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.RegistrationNumber}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Finance Type', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.FinanceType}`, style: 'tableContent'
                    },
                    {
                      text: 'Financed From', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.FinancedForm}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'NOC Availability', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.NOCAvailibility}`, style: 'tableContent'
                    },
                    {
                      text: 'Vehicle Valuation', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.VehicleInvestigationData.VehicleValuation)}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Finance Capability', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.VehicleInvestigationData.FinanceCapability)}`, style: 'tableContent'
                    },
                    {
                      text: 'Loan Amount Required', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.LoanAmountRequired}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Physical Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.PhysicalCondition}`, style: 'tableContent'
                    },
                    {
                      text: 'Ride Quality', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.RideQuality}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Remarks', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.Remarks}`, colSpan: 3, style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableHeader'
                    },
                    {
                      text: ``, style: 'tableContent'
                    }
                  ]
                ]
              },
            }
          ],
          styles: {
            leftHeader: {
              alignment: 'left',
              fontSize: 13,
              bold: true
            },
            leftData: {
              alignment: 'left',
              fontSize: 10,
              lineHeight: 1.5,
              margin: [15, 0, 0, 0]
            },
            leftHeaderHindi: {
              alignment: 'left',
              fontSize: 10,
              bold: true,
              font: 'Glegoo'
            },
            leftDataHindi: {
              alignment: 'left',
              fontSize: 10,
              lineHeight: 1.15,
              margin: [15, 0, 0, 0],
              font: 'Glegoo'
            },
            header: {
              fontSize: 28,
              // 			bold: true,
              margin: [
                0,
                0,
                0,
                10
              ]
            },
            content: {
              fontSize: 12,
              margin: [
                0,
                0,
                0,
                4
              ]
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [
                0,
                10,
                0,
                5
              ]
            },
            tableExample: {
              margin: [
                0,
                5,
                0,
                5
              ],
              width: 400
            },
            tableHeader: {
              bold: true,
              fontSize: 8.5,
              color: 'black',
              margin: [
                0,
                5
              ]
            },
            tableContent: {
              fontSize: 9,
              margin: [
                0,
                5
              ]
            }
          },
          defaultStyle: {
            alignment: 'center',
            font: 'Courier'
          }
        }
      }
      else {
        var dd = {
          pageMargins: [40, 120, 40, 60],
          pageSize: 'A4',
          header: {

            columns: [
              {
                stack: ['\n',
                  {
                    text: 'Navya Enterprises', style: 'header'
                  },
                  {
                    text: 'Prop Neel Sarin', style: 'content'
                  },
                  {
                    text: '70/144 Patel Marg, Mansrovar Jaipur', style: 'content'
                  },
                ]
              }

            ],
          },
          footer: function (currentPage, pageCount) {

            return {
              columns: [
                { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 20, 0, 0] },

              ]
            }
          },
          content: [
            {
              columns: [
                {
                  text: 'Field Investigation Form', style: 'leftHeader', align: 'left'
                },
                {
                  text: `Account Number- ${profile_id}`, style: 'leftHeader', align: 'right'
                }
              ]
            },
            {
              text: 'Auto Loan', style: 'leftHeader'
            },
            '\n',
            {
              style: 'tableExample',
              table: {
                dontBreakRows: true,
                widths: [
                  105, '*', 105, '*'
                ],
                heights: 20,
                body: [
                  [
                    {
                      text: 'General Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Full Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.FullName}`, style: 'tableContent'
                    },
                    {
                      text: 'Date of Creation', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.Dob}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Loan Amount', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.GeneralDetails.LoanAmount)}`, style: 'tableContent'
                    },
                    {
                      text: 'Mobile Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.GeneralDetails.MobileNumber}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Residence Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Residence Address', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseAddress}`, colSpan: 3, style: 'tableContent'
                    },
                    {}, {}
                  ],
                  [
                    {
                      text: 'Residence Landmark', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseLandmark}`, colSpan: 3, style: 'tableContent'
                    },
                    {}, {}
                  ],
                  [
                    {
                      text: 'Residence Accessibility', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HomeAccesibility}`, style: 'tableContent'
                    },
                    {
                      text: 'Residence Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.HouseConndition}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Locality Type', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.LocalityType}`, style: 'tableContent'
                    },
                    {
                      text: 'Address Proof', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AddressProof}`, style: 'tableContent'
                    }
                  ],

                  [
                    {
                      text: 'Total Family Members', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.TotalFamilyNumbers}`, style: 'tableContent'
                    },
                    {
                      text: 'Earning Members', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.EarningMembers}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Acquaintance Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AcquaintanceName}`, style: 'tableContent'
                    },
                    {
                      text: 'Acquaintance Phone', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.ResidenceInvestigationData.AcquaintancePhone}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Workplace Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Employer Name', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.EmployerName}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Office Address', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeAddress}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Office Landmark', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeLandmark}`, colSpan: 3, style: 'tableContent'
                    }, {}, {}
                  ],
                  [
                    {
                      text: 'Designation', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.Designation}`, style: 'tableContent'
                    },
                    {
                      text: 'Job Duration', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.JobDuration}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Inhand Salary', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.WorkplaceInvestigationData.InHandSalary)}`, style: 'tableContent'
                    },
                    {
                      text: 'Office Accessibility', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeAccesibility}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Office Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.WorkplaceInvestigationData.OfficeCondition}`, colSpan: 3, style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableHeader'
                    },
                    {
                      text: ``, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Investigation Details', style: 'tableHeader', colSpan: 4
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleNumber}`, style: 'tableContent'
                    },
                    {
                      text: 'Vehicle Brand', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleBrand}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Vehicle Model', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.VehicleModel}`, style: 'tableContent'
                    },
                    {
                      text: 'Odometer Reading', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.OdometerReading}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Chassis Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.ChasisNumber}`, style: 'tableContent'
                    },
                    {
                      text: 'Engine Number', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.RegistrationNumber}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Finance Type', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.FinanceType}`, style: 'tableContent'
                    },
                    {
                      text: 'Vehicle Valuation', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.VehicleInvestigationData.VehicleValuation)}`, style: 'tableContent'
                    }

                  ],
                  [
                    {
                      text: 'Finance Capability', style: 'tableHeader'
                    },
                    {
                      text: `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fi_data.VehicleInvestigationData.FinanceCapability)}`, style: 'tableContent'
                    },
                    {
                      text: 'Loan Amount Required', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.LoanAmountRequired}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Physical Condition', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.PhysicalCondition}`, style: 'tableContent'
                    },
                    {
                      text: 'Ride Quality', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.RideQuality}`, style: 'tableContent'
                    }
                  ],
                  [
                    {
                      text: 'Remarks', style: 'tableHeader'
                    },
                    {
                      text: `${fi_data.VehicleInvestigationData.Remarks}`, colSpan: 3, style: 'tableContent'
                    },
                    {
                      text: '', style: 'tableHeader'
                    },
                    {
                      text: ``, style: 'tableContent'
                    }
                  ]
                ]
              },
            }
          ],
          styles: {
            leftHeader: {
              alignment: 'left',
              fontSize: 13,
              bold: true
            },
            leftData: {
              alignment: 'left',
              fontSize: 10,
              lineHeight: 1.5,
              margin: [15, 0, 0, 0]
            },
            leftHeaderHindi: {
              alignment: 'left',
              fontSize: 10,
              bold: true,
              font: 'Glegoo'
            },
            leftDataHindi: {
              alignment: 'left',
              fontSize: 10,
              lineHeight: 1.15,
              margin: [15, 0, 0, 0],
              font: 'Glegoo'
            },
            header: {
              fontSize: 28,
              // 			bold: true,
              margin: [
                0,
                0,
                0,
                10
              ]
            },
            content: {
              fontSize: 12,
              margin: [
                0,
                0,
                0,
                4
              ]
            },
            subheader: {
              fontSize: 16,
              bold: true,
              margin: [
                0,
                10,
                0,
                5
              ]
            },
            tableExample: {
              margin: [
                0,
                5,
                0,
                5
              ],
              width: 400
            },
            tableHeader: {
              bold: true,
              fontSize: 8.5,
              color: 'black',
              margin: [
                0,
                5
              ]
            },
            tableContent: {
              fontSize: 9,
              margin: [
                0,
                5
              ]
            }
          },
          defaultStyle: {
            alignment: 'center',
            font: 'Courier'
          }
        }
      }


      const pdfBuffer = await new Promise(resolve => {
        const pdfMake = printer.createPdfKitDocument(dd);

        let chunks = [];

        pdfMake.on("data", chunk => {
          chunks.push(chunk);
        });
        pdfMake.on("end", () => {
          const result = Buffer.concat(chunks);
          var now = new Date();
          now.setMinutes(now.getMinutes() + 30); // timestamp
          now = new Date(now); // Date object
          s3.putObject(
            {
              Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
              Key: `PersonalLoan/${profile_id}/${filename}`,
              Body: result,
              Expires: now
            },
            function (resp, d) {
              resolve(result)
            }
          )
        });


        pdfMake.end();
      })

      const a = pdfBuffer


      const preSignedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
        Key: `PersonalLoan/${profile_id}/${filename}`, // File name could come from queryParameters
      });


      return res.status(200).json(preSignedUrl)

    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: err });
    }
  };

  const makePdfForKYC = async (req, res) => {
    const profile_id = req.query.profile_id;
    // const loan_id = req.query.loan_id;
    const filename = req.query.filename;
    try {
      let profile = await UserProfile.findOne({
        where: {
          user_id: profile_id
        }
      });

     

      let kyc = profile.details_json[profile_id].kyc

      var fonts = {
        Courier: {
          normal: 'fonts/cour.ttf',
          bold: 'fonts/courbd.ttf',
          italics: 'fonts/couri.ttf',
          bolditalics: 'fonts/courbi.ttf'
        },
        Glegoo: {
          normal: 'fonts/Glegoo-Regular.ttf',
          bold: 'fonts/Glegoo-Bold.ttf',
          italics: 'fonts/Glegoo-Regular.ttf',
          bolditalics: 'fonts/Glegoo-Regular.ttf'
        }
      };
      var printer = new pdfmake(fonts);
      const age = moment().diff(`${kyc.CarJSON.applicantModel.applicant_dob}`, 'years', false)
      const otherDetailsArray = await sequelize.query(`SELECT acquaintance.acquaintance_name, maritalstatus.maritalstatus_name, caste.caste_name, category.category_name, documenttype.documenttype_name
      FROM public.acquaintance, public.maritalstatus, public.caste, public.category, public.documenttype
      where acquaintance.acquaintance_id= ${kyc.CarJSON.applicantModel.applicant_acquaintanceid} and maritalstatus.maritalstatus_id=${kyc.CarJSON.applicantModel.applicant_maritalstatusid} and caste.caste_id=${kyc.CarJSON.applicantModel.applicant_casteid} and category.category_id=${kyc.CarJSON.applicantModel.applicant_categoryid} and documenttype.documenttype_id=${kyc.CarJSON.documentModel.document_id};`)
      console.log(otherDetailsArray)
      const otherDetails = otherDetailsArray[0][0];
      console.log(otherDetails)
      var dd = {
        pageMargins: [40, 120, 40, 60],
        pageSize: 'A4',
        header: {

          columns: [
            {
              stack: ['\n',
                {
                  text: 'Navya Enterprises', style: 'header'
                },
                {
                  text: 'Prop Neel Sarin', style: 'content'
                },
                {
                  text: '70/144 Patel Marg, Mansrovar Jaipur', style: 'content'
                },
              ]
            }

          ],
        },
        footer: function (currentPage, pageCount) {
          
            return {
              columns: [
                { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 20, 0, 0] },

              ]
            }
        },
        content: [ 
          {
            columns: [
              {
                text: 'Applicant Details Form', style: 'leftHeader', align: 'left'
              },
              {
                text: `Account Number- ${profile_id}`, style: '', align: 'right'
              }
            ]
          },
          '\n',
          { 
            style: 'tableExample',
            table: {
              dontBreakRows: true,
              widths: [
                105, 135, 105,135
              ],
              heights: 20,
              body: [
                  [
                  {
                    text: 'Applicant Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'First Name', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_firstname}`, style: 'tableContent'
                  },
                  {
                    text: 'Middle Name', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_middlename}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Last Name', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_lastname}`, style: 'tableContent'
                  },
                  {
                    text: 'Acquaintance', style: 'tableHeader' 
                  },
                  {
                    text: `${otherDetails.acquaintance_name}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Acquaintance Name', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_acquaintancename}`, style: 'tableContent'
                  },
                  {
                    text: 'Date of Birth', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_dob}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Age', style: 'tableHeader'
                  },
                  {
                    text: `${age}`, style: 'tableContent'
                  },
                  {
                    text: 'Marital Status', style: 'tableHeader' 
                  },
                  {
                    text: `${otherDetails.maritalstatus_name}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Caste', style: 'tableHeader'
                  },
                  {
                    text: `${otherDetails.caste_name}`, style: 'tableContent'
                  },
                  {
                    text: 'Category', style: 'tableHeader' 
                  },
                  {
                    text: `${otherDetails.category_name}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'State', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_state}`, style: 'tableContent'
                  },
                  {
                    text: 'District', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_district}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Pincode', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_pincode}`, style: 'tableContent'
                  },
                  {
                    text: 'Mobile Number', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_mobile}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Office Number', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_officeno}`, style: 'tableContent'
                  },
                  {
                    text: 'Designation', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_desgination}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Education', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_education}`, style: 'tableContent'
                  },
                  {
                    text: 'Employer Name', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_employername}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Distance To NE', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_distance}`, style: 'tableContent'
                  },
                  {
                    text: 'Nearest Branch', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_nearestbranch}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Office Address', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_officeaddress}`, style: 'tableContent', colSpan: 3
                  },
                  {
                    text: '', style: 'tableHeader' 
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Home Address', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.applicantModel.applicant_currentaddress}`, style: 'tableContent', colSpan: 3
                  },
                  {
                    text: '', style: 'tableHeader' 
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Co-Applicant Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'First Name', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_firstname}`, style: 'tableContent'
                  },
                  {
                    text: 'Middle Name', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_middlename}`, style: 'tableContent'
                  }
                ],
                [
                   {
                    text: 'Last Name', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_lastname}`, style: 'tableContent'
                  },
                  {
                    text: 'Mobile Number', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_mobile}`, style: 'tableContent'
                  }
                ],
                
                [
                  {
                    text: 'Relationship', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_relation}`, style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableHeader' 
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Co-Applicant/Guarantor Address', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.gurantorModel.gurantor_currentaddress}`, style: 'tableContent', colSpan:3
                  },
                  {
                    text: '', style: 'tableHeader' 
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Financial Details', style: 'tableHeader', colSpan: 4
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  },
                  {
                    text: '', style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Aadhar Number', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.documentModel.document_aadhar}`, style: 'tableContent'
                  },
                  {
                    text: 'Pan Number', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.documentModel.document_pan}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Cibil Score', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.documentModel.document_cibil}`, style: 'tableContent'
                  },
                  {
                    text: 'Optional ID Type', style: 'tableHeader' 
                  },
                  {
                    text: `${otherDetails.documenttype_name}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Optional ID Details', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.documentModel.document_optional}`, style: 'tableContent'
                  },
                  {
                    text: 'Monthly Inhand Income', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.accountModel.account_inhandsalary}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'Bank Name', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.accountModel.account_bankname}`, style: 'tableContent'
                  },
                  {
                    text: 'Account Number', style: 'tableHeader' 
                  },
                  {
                    text: `${kyc.CarJSON.accountModel.account_number}`, style: 'tableContent'
                  }
                ],
                [
                  {
                    text: 'IFSC', style: 'tableHeader'
                  },
                  {
                    text: `${kyc.CarJSON.accountModel.account_ifsc}`, style: 'tableContent', colSpan:3
                  },
                  {
                    text: '', style: 'tableHeader' 
                  },
                  {
                    text: ``, style: 'tableContent'
                  }
                ]
              ]
            },
          }
        ],
        styles: {
          leftHeader: {
            alignment: 'left',
            fontSize: 16,
            bold: true
          },
          leftData: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.5,
            margin: [15, 0, 0, 0]
          },
          leftHeaderHindi: {
            alignment: 'left',
            fontSize: 10,
            bold: true,
            font: 'Glegoo'
          },
          leftDataHindi: {
            alignment: 'left',
            fontSize: 10,
            lineHeight: 1.15,
            margin: [15, 0, 0, 0],
            font: 'Glegoo'
          },
          header: {
            fontSize: 28,
            // 			bold: true,
            margin: [
              0,
              0,
              0,
              10
            ]
          },
          content: {
            fontSize: 12,
            margin: [
              0,
              0,
              0,
              4
            ]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [
              0,
              10,
              0,
              5
            ]
          },
          tableExample: {
            margin: [
              0,
              5,
              0,
              5
            ],
            width: 400
          },
          tableHeader: {
            bold: true,
            fontSize: 8.5,
            color: 'black',
            margin: [
              0,
              5
            ]
          },
          tableContent: {
            fontSize: 9,
            margin: [
              0,
              5
            ]
          }
        },
        defaultStyle: {
          alignment: 'center',
          font: 'Courier'
        }
      }



      const pdfBuffer = await new Promise(resolve => {
        const pdfMake = printer.createPdfKitDocument(dd);

        let chunks = [];

        pdfMake.on("data", chunk => {
          chunks.push(chunk);
        });
        pdfMake.on("end", () => {
          const result = Buffer.concat(chunks);
          var now = new Date();
          now.setMinutes(now.getMinutes() + 30); // timestamp
          now = new Date(now); // Date object
          s3.putObject(
            {
              Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
              Key: `KYCPdf/${profile_id}/${filename}`,
              Body: result,
              Expires: now
            },
            function (resp, d) {
              resolve(result)
            }
          )
        });


        pdfMake.end();
      })

      const a = pdfBuffer


      const preSignedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
        Key: `KYCPdf/${profile_id}/${filename}`, // File name could come from queryParameters
      });


      return res.status(200).json(preSignedUrl)

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
    approveDocument,
    resubmitDocument,
    resubmitFI,
    makePdf,
    makePdfForPersonalLoan,
    makePdfForAutoLoan,
    makePdfForKYC
  };
};







// exporting the module 
module.exports = FIController
