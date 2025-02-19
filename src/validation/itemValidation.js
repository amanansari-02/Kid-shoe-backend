const Joi = require("joi");

const itemSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  type: Joi.string().required(),
});

module.exports = { itemSchema };
