const ERROR_MESSAGE = require("../constant/errorMessage");
const STATUS_CODE = require("../constant/statusCode");

const validate = (schmea) => (req, res, next) => {
  const { error } = schmea.validate(req.body, { aboutEarly: false });
  if (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      message: ERROR_MESSAGE.VALIDATION_ERROR,
      error: error.details.map((detail) => detail.message),
    });
  }
  next();
};

module.exports = validate;
