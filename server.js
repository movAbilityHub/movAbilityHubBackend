const express = require("express");

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const dotenvConfig = require("dotenv").config();

const routes = require("./routes");

const app = express();
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/mongoKey").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/", routes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
