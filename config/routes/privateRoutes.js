/*
File DEscription: Creating the pricate Routes to perform API operations with database
Author: Rishabh Merhotra
*/


// importing the carcontroller to perform sequelize operations 
const CarController = require("../../api/controllers/CarController");

const privateRoutes = {
  // Login Controller Routes
  'GET /User/logins': 'LoginController.getAll',
  'GET /Security/getInkredoAccessKeys': 'LoginController.getAccessKeys',
  
  'POST /User/disableUser': 'LoginController.disableUser',

  // Car Controller Routes
  'GET /CAR/getForUser': 'CarController.get',
  'GET /CAR/getAllAadhar': 'CarController.getAadharList',
  'GET /CAR/getAllPan': 'CarController.getPanList',
  'GET /CAR/getFnameWithAadhar': 'CarController.getFnameAndAadhar',
  'GET /CAR/getComboBoxData': 'CarController.getComboBoxData',
  'GET /CAR/getCountOfKyc': 'CarController.getCountOfKyc',
  'GET /CAR/getProfileIdList': 'CarController.getUserProfileID',
  'GET /CAR/getProfileForID': 'CarController.getProfileForProfileID',
  'GET /Inkredo/getPreSignedUrl': 'CarController.getPreSignedUrl',
  'GET /Inkredo/getPreSignedUrlForRetrieval': 'CarController.getPreSignedUrlForRetrieval',
  'GET /CAR/approveKYC': 'CarController.approveKYC',
  'GET /CAR/getAgentNameForKYC': 'CarController.getAgentNameForKYC',
  'GET /CAR/terminateLoan': 'CarController.terminateLoan',
  'GET /CAR/finishLoan': 'CarController.finishLoan',
  'GET /CAR/getAdminPanelData': 'CarController.getAdminPanelData',
  'GET /CAR/getLeadForToken': 'CarController.getLeadForToken',
  'GET /CAR/getAllLeads': 'CarController.getAllLeads',
  'GET /CAR/getLeadForUserId': 'CarController.getLeadForUserId',
  'GET /CAR/getKYCData': 'CarController.getKYCData',
  'GET /CAR/deleteLead': 'CarController.deleteLead',

  'POST /CAR/create': 'CarController.register',
  'POST /CAR/insertNewInkredoDetails': 'CarController.insertBorrowerDetails',
  'POST /CAR/insertNewLoan': 'CarController.insertNewLoan',
  'POST /CAR/createLead': 'CarController.createLead',

  // 'POST /createUserProfile': 'UserProfileController.create',
  // 'GET /userProfiles': 'UserProfileController.getAll'

  
  // Fi controller Routes 

  'POST /FI/insertNewFIData': 'FiController.register',
  'POST /FI/assignTo': 'FiController.assignTo',


  'GET /FI/getComboBoxData': 'FiController.getComboBoxData',
  'GET /FI/getPreSignedUrl': 'FiController.getPreSignedUrl',
  'GET /FI/getAllPendingList': 'FiController.getAllPendingList',
  'GET /FI/getPreSignedUrlForRetrieval': 'FiController.getPreSignedUrlForRetrieval',
  'GET /FI/getFiSubmittedPendingForUser': 'FiController.getFiSubmittedPendingForUser',
  'GET /FI/getDocumentCheckUploadPendingForUser': 'FiController.getDocumentCheckUploadPendingForUser',
  'GET /FI/approveFI': 'FiController.approveFI',
  'GET /FI/resubmitFI': 'FiController.resubmitFI',
  'GET /FI/makePdf': 'FiController.makePdf',
  'GET /FI/makePdfForPersonalLoan': 'FiController.makePdfForPersonalLoan',
  'GET /FI/makePdfForAutoLoan': 'FiController.makePdfForAutoLoan',

  'GET /Document/getPreSignedUrl': 'FiController.getPreSignedUrlDocument',
  'GET /Document/getPreSignedUrlForRetrieval': 'FiController.getPreSignedUrlForRetrievalDocument',
  'GET /Document/getEMISchedule': 'FiController.getEMISchedule',
  'GET /Document/resubmitDocument': 'FiController.resubmitDocument',

  'POST /Document/createDocumentApprovePending': 'FiController.createDocumentApprovePending',
  'POST /Document/createEMISchedule': 'FiController.createEMISchedule',
  'POST /Document/approveDocument': 'FiController.approveDocument',



};

module.exports = privateRoutes;