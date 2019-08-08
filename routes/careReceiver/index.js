const router = require("express").Router();
const keys = require("../../config/mongoKey");

const passport = require("passport");

const CareReceiver = require("../../models/careReceiver");
