/*
File Description: Tests for the Fi controllers using the models 
Author: Rishabh Merhotra 
*/

// importing the super test for unit-testing the api 
const request = require('supertest');
const {
  // calling the functions from the setup file
  beforeAction,
  afterAction,
} = require('../setup/_setup');

const Fi = require('../models/Fi')

//UTF-8 is a variable-width character encoding 

let api;

beforeAll(async () => {
  api = await beforeAction();
});

afterAll(() => {
  afterAction();
});

test('Create an Fi', async () => {

    /**
   * Creating an Fi
   * @constructor
   * @param {response} = req.api 
   * @param Fi created using - fi_id , fi_answer, related Aadhar and related pan
   * Created an Fi
   */
  
    // post request with details to register
    const res = await request(api)
      .post('/private/fi')
      .set('Accept', /json/)
      .send({
        "fi_id": 852852,
        "fi_answers": { add : fi },
        "related_aadhar": "777777777777",
        "related_pan": "ASFGS8299D",

      })
      // 200 to be ok! 
      .expect(200);
    console.log(res.body)
    expect(res.body.msg).toBe('Fi  created successfully!!');

})