/*
File DEscription: Creating a controller to perform API operations with database
Author: Rishabh Merhotra
logs: 07/10/2020 - Added joi validation 
*/
// Importing all the models from the model folder 
const FI = require('../models/Fi');
const pdfmake = require('pdfmake')
const fs = require('fs');
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
        pageMargins: [40, 140, 40, 60],
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
        footer: function (currentPage, pageCount) { return { text: currentPage.toString() + ' of ' + pageCount, margin: [0, 30, 0, 0] } },
        content: [
          {
            style: 'tableExample',
            table: {
              dontBreakRows: true,
              widths: [
                150, '*', '*'
              ],
              heights: 25,
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
            fontSize: 11.5,
            color: 'black',
            margin: [
              0,
              5
            ]
          },
          tableContent: {
            fontSize: 12,
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
        pdfMake.on("end",() => {
          const result = Buffer.concat(chunks);
  
          s3.putObject(
            {
              Bucket: 'my-express-application-dev-s3bucket-1eil6gs9s5nx2',
              Key: `EMI/${profile_id}/${filename}`,
              Body: result
            },
            function (resp, d) {
              console.log('First')
              resolve(result)
              console.log({resp,d})
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
      console.log('Second')

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
    makePdf
  };
};







// exporting the module 
module.exports = FIController
