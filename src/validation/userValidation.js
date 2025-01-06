const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { userSchema };
