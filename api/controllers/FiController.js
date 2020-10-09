/* File Description: Controlling the Api For all Fi related tasks by registering and Joi Validation included
Author: Rishabh Mehrothra
*/
// importing the fi model 

const Fi = require('../models/Fi');

//importing Joi validation 

const { fiSchema }= require('../joi_validation/joi_validation_fi_controller')


const fiController = () => {

                /**
                 * Regestering an fi 
                 * @Accepts the request and responses
                 * @param {req} body - in the form of req.body
                 * @param fi is created using fi_id, fi_answers, related adhaaar and related pan
                 * fi- Created
                 */

                const fi_register = async (req, res) => {
                    // registering the fi 
                    const { body } = req; 
                    const result = Joi.validate(body, fiSchema); 
                    const { value, error } = result; 
                    const valid = error == null; 
                    if (!valid) { 
                    res.status(422).json({ 
                        message: 'Invalid request', 
                        data: body 
                    }) 
                    } else { 
                    // req.body 
                            try {

                                const fi = await Fi.create({
                                    fi_id: body.fi_id,
                                    fi_answers: body.fi_answers,
                                    related_aadhar: body.related_aadhar, 
                                    related_pan: body.related_pan

                                  });
                                  
                            
                                  // 200 ok! 
                                  return res.status(200).json({ msg: 'Fi submitted successfully!!' });
                                } catch (err) {
                                  console.log(err);
                                  return res.status(500).json({ msg: 'Internal server error' });
                                }
                              };

                              return fi_register



                            }
}

module.exports  = fiController