const ERROR_MESSAGE = require("../constant/errorMessage");
const STATUS_CODE = require("../constant/statusCode");
const SUCCESS_MESSAGE = require("../constant/successMessage");
const Users = require("../models/usersModel");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  try {
    // check user already exists by email
    const previousUser = await Users.find({ email: req.body.email });
    if (previousUser) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        status: STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.USER_EXISTS,
      });
    }

    // hash password
    const salRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, salRounds);
    req.body.password = hashedPassword;

    // Add new user
    const newUser = new Users(req.body);
    await newUser.save();
    return res.status(STATUS_CODE.CREATED).json({
      status: STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.USER_ADDED,
    });
  } catch (error) {
    console.error("addUser: ", error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const users = await Users.find({}, { password: 0 }).lean();
    return res.status(STATUS_CODE.OK).json({
      status: STATUS_CODE.OK,
      message: SUCCESS_MESSAGE.GET_ALL_USERS,
      users: users,
    });
  } catch (error) {
    console.error("getUser: ", error);
  }
};
