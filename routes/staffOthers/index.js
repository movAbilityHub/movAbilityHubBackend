const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/mongoKey");

const passport = require("passport");

// Load input validation
const validateOtherStaffRegisterInput = require("../../validation/otherStaffRegister");
const validateLoginInput = require("../../validation/login");

// Load User model
const StaffOthers = require("../../models/staffOthers");

// @route POST users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateOtherStaffRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  StaffOthers.findOne({ email: req.body.email }).then(staff => {
    if (staff) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newStaff = new StaffOthers({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        organisationName: req.body.organisationName,
        code: req.body.code,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        countryCode: req.body.countryCode,
        password: req.body.password,
        userType: req.body.userType
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStaff.password, salt, (err, hash) => {
          if (err) throw err;
          newStaff.password = hash;
          newStaff
            .save()
            .then(staff => res.status(201))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType;

  // Find user by email
  StaffOthers.findOne({ email }).then(staff => {
    // Check if user exists
    if (!staff) {
      return res.status(404).json({ userNotFound: "User not found" });
    }

    // Check if user exists
    if (!staff.approvedOn) {
      return res.status(400).json({ account: "Account not approved" });
    }

    if (staff.userType !== userType) {
      return res.status(400).json({ userNotFound: "User not found" });
    }

    // Check password
    bcrypt.compare(password, staff.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: staff._id,
          code: staff.code,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          organisationName: staff.organisationName,
          phoneNumber: staff.phoneNumber,
          countryCode: staff.countryCode,
          userType: staff.userType
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 604800 // 7 days in seconds
          },
          (err, token) => {
            res.status(200).json({
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
