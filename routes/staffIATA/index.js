const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/mongoKey");

const passport = require("passport");

// Load input validation
const validateIATAStaffRegisterInput = require("../../validation/iataStaffRegister");
const validateLoginInput = require("../../validation/login");
const validateAccountApproval = require("../../validation/staffAccountApproval");
const validateRejectAccount = require("../../validation/rejectAccount");
// Load User model
const StaffIATA = require("../../models/staffIATA");
const StaffOthers = require("../../models/staffOthers");

// @route POST users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateIATAStaffRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  StaffIATA.findOne({ email: req.body.email }).then(staff => {
    if (staff) {
      return res.json({ email: "Email already exists" });
    } else {
      const newStaff = new StaffIATA({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        staffID: req.body.staffID
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStaff.password, salt, (err, hash) => {
          if (err) throw err;
          newStaff.password = hash;
          newStaff
            .save()
            .then(staff => res.status(201).json({ success: true }))
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
    return res.json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  StaffIATA.findOne({ email }).then(staff => {
    // Check if user exists
    if (!staff) {
      return res.json({ userNotFound: "User not found" });
    }

    // Check password
    bcrypt.compare(password, staff.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: staff._id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phoneNumber: staff.phoneNumber,
          staffID: staff.staffID,
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
              token: token,
              success: true
            });
          }
        );
      } else {
        return res.json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/approveAccount", (req, res) => {
  // Form validation

  const { errors, isValid } = validateAccountApproval(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  StaffOthers.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        approved: true,
        approvedOn: Date.now(),
        approvedBy: req.body.name,
        staffID: req.body.staffID
      }
    },
    { multi: true, new: true },
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({
        message: { message: { message: "Account approved." } },
        success: true
      });
    }
  );
});

router.post("/rejectAccount", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRejectAccount(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  StaffOthers.findByIdAndRemove(req.body.id, (err, request) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send({
      message: { message: { message: "Registration request rejected." } },
      success: true
    });
  });
});

router.get("/fetchApprovedAccounts", (req, res) => {
  StaffOthers.find({ approved: true }, (err, accounts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ accounts: accounts });
  });
});

router.get("/fetchAccountsAwaitingApproval", (req, res) => {
  StaffOthers.find({ approved: false }, (err, accounts) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ accounts: accounts, success: true });
  });
});

module.exports = router;
