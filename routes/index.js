const express = require("express");
const router = express.Router();

//import api file for each operation
const customer = require("./customer");
const staffIATA = require("./staffIATA");
const staffOthers = require("./staffOthers");
const request = require("./request");
const careReceiver = require("./careReceiver");
const travelAgents = require("./travelAgents");

//creating route to the imported location
router.use("/customer", customer);
router.use("/staffIATA", staffIATA);
router.use("/staffOthers", staffOthers);
router.use("/request", request);
router.use("/careReceiver", careReceiver);
router.use("/travelAgents", travelAgents);

module.exports = router;
