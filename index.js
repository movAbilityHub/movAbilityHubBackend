const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenvConfig = require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
