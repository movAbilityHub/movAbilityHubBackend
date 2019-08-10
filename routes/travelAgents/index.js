const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/mongoKey");

const passport = require("passport");

// Load input validation
const validateTravelAgentsRegisterInput = require("../../validation/travelAgentsRegister");
const validateLoginInput = require("../../validation/login");

// Load User model
const TravelAgents = require("../../models/travelAgents");

// @route POST users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateTravelAgentsRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  TravelAgents.findOne({ email: req.body.email }).then(agent => {
    if (agent) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newTravelAgent = new TravelAgents({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        agencyCode: req.body.agencyCode,
        phoneNumber: req.body.phoneNumber,
        countryCode: req.body.countryCode,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newTravelAgent.password, salt, (err, hash) => {
          if (err) throw err;
          newTravelAgent.password = hash;
          newTravelAgent
            .save()
            .then(agent => res.status(201))
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

  // Find user by email
  TravelAgents.findOne({ email }).then(agent => {
    // Check if user exists
    if (!agent) {
      return res.status(404).json({ userNotFound: "User not found" });
    }

    // Check password
    bcrypt.compare(password, agent.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: agent._id,
          firstName: agent.firstName,
          lastName: agent.lastName,
          email: agent.email,
          phoneNumber: agent.phoneNumber,
          countryCode: agent.countryCode,
          agencyCode: agent.agencyCode,
          userType: agent.userType
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
