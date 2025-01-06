const express = require("express");
const { addUser, getUser } = require("../controller/usersController");
const validate = require("../middleware/validation");
const { userSchema } = require("../validation/userValidation");
const router = express.Router();

router.post("/user", validate(userSchema), addUser);
router.get("/user", getUser);

module.exports = router;
