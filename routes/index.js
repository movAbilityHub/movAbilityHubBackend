const express = require("express");
const router = express.Router();

//import api file for each operation
const customer = require("./customer");

//creating route to the imported location
router.use("/customer", customer);

module.exports = router;
