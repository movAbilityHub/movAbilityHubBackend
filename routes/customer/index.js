const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/mongoKey");

const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateDestonation = require("../../validation/validateDestination");
const validateDeparture = require("../../validation/validateDeparture");

// Load User model
const Customer = require("../../models/customers");
const StaffOthers = require("../../models/staffOthers");
// @route POST users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  Customer.findOne({ email: req.body.email }).then(customer => {
    if (customer) {
      return res.json({ email: "Email already exists" });
    } else {
      const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCustomer.password, salt, (err, hash) => {
          if (err) throw err;
          newCustomer.password = hash;
          newCustomer
            .save()
            .then(customer =>
              res
                .status(200)
                .json({ message: "Registration successful", success: true })
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

  // Find user by email
  Customer.findOne({ email }).then(customer => {
    // Check if user exists
    if (!customer) {
      return res.json({ userNotFound: "User not found" });
    }

    // Check password
    bcrypt
      .compare(password, customer.password)
      .then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: customer._id,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            userType: customer.userType
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
      })
      .catch(err => res.status(400).send({ error: err }));
  });
});

router.post("/checkDestination", (req, res) => {
  // Form validation

  const { errors, isValid } = validateDestonation(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  StaffOthers.findOne({
    code: req.body.destination
  })
    .then(result => {
      if (!result) {
        return res.json({
          errors: "Destination airport has not registered."
        });
      } else {
        return res.json({ success: true });
      }
    })
    .catch(err => res.status(400).send(err));
});

router.post("/checkDeparture", (req, res) => {
  // Form validation

  const { errors, isValid } = validateDeparture(req.body);

  // Check validation
  if (!isValid) {
    return res.json(errors);
  }

  StaffOthers.findOne({
    code: req.body.departure
  })
    .then(result => {
      if (!result) {
        return res.json({
          errors: "Departure airport has not registered."
        });
      } else {
        return res.json({ success: true });
      }
    })
    .catch(err => res.status(400).send(err));
});

module.exports = router;
