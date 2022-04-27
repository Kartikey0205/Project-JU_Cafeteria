require("dotenv").config();

// Express Server required package
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// Database stuff
const mongoose = require("mongoose");

// requiring all links that coming from env file via setup directory and my file inside it
const myfile = require("./setup/myFile");

const app = express();
// Dynamic Port
const PORT = process.env.PORT || 5500;

// Database connection
const db = myfile.dbUrl;
//Attempt to connect to database
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connected succesfully..");
  })
  .catch((err) => {
    console.log("Error is ", err);
  });

// Assests for MIME type accrordingly setting Content Type
app.use(express.static("public"));

// set Template Engine
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// routes imported
require("./routes/web")(app);

// Listening to server
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
