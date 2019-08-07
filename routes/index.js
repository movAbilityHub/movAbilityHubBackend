const express = require("express");
const router = express.Router();

//import api file for each operation
const customer = require("./customer");
const staffIATA = require("./staffIATA");
const staffOthers = require("./staffOthers");
const request = require("./request");

//creating route to the imported location
router.use("/customer", customer);
router.use("/staffIATA", staffIATA);
router.use("/staffOthers", staffOthers);
router.use("/request", request);

module.exports = router;
