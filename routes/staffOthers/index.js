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
    return res.json(errors);
  }

  StaffOthers.findOne({ email: req.body.email }).then(staff => {
    if (staff) {
      return res.json({ email: "Email already exists" });
    } else {
      const newStaff = new StaffOthers({
        organisationName: req.body.organisationName,
        code: req.body.code,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
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
            .then(staff =>
              res.status(200).json({
                message:
                  "Registration requested successfully. Contact your IATA representative to confirm registration.", success: true
              })
            )
            .catch(err => res.status(400).send({ error: err }));
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
    return res.json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType;

  // Find user by email
  StaffOthers.findOne({ email }).then(staff => {
    // Check if user exists
    if (!staff) {
      return res.json({ userNotFound: "User not found" });
    }

    // Check if user exists
    if (!staff.approvedOn) {
      return res.json({ account: "Account not approved" });
    }

    if (staff.userType !== userType) {
      return res.json({ userNotFound: "User not found" });
    }

    // Check password
    bcrypt.compare(password, staff.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: staff._id,
          code: staff.code,
          email: staff.email,
          organisationName: staff.organisationName,
          phoneNumber: staff.phoneNumber,
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
              token: token, success: true
            });
          }
        );
      } else {
        return res.json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
