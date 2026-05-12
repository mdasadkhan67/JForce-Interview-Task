const Joi = require('joi');

const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required()
});

const taskCreateSchema = Joi.object({
  expenseName: Joi.string().min(2).max(255).required(),
  amount: Joi.number().positive().required(),
  expenseDate: Joi.date().iso().required(),
  description: Joi.string().max(1000).allow('', null)
});

const taskUpdateSchema = Joi.object({
  expenseName: Joi.string().min(2).max(255),
  amount: Joi.number().positive(),
  expenseDate: Joi.date().iso(),
  description: Joi.string().max(1000).allow('', null)
}).min(1);

const validateRegistration = (data) => {
  return registrationSchema.validate(data, { abortEarly: false, allowUnknown: false });
};

const validateLogin = (data) => {
  return loginSchema.validate(data, { abortEarly: false, allowUnknown: false });
};

const validateTaskCreation = (data) => {
  return taskCreateSchema.validate(data, { abortEarly: false, allowUnknown: false });
};

const validateTaskUpdate = (data) => {
  return taskUpdateSchema.validate(data, { abortEarly: false, allowUnknown: false });
};

const formatValidationErrors = (error) => {
  if (!error || !error.details) return [];
  return error.details.map((detail) => ({
    field: detail.path.join('.') || detail.context?.key,
    message: detail.message.replace(/\"/g, '')
  }));
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTaskCreation,
  validateTaskUpdate,
  formatValidationErrors
};
