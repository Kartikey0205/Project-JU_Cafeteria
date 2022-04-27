require("dotenv").config();

// Express Server required package
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// Database stuff
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");

// connect-mongo is used to store session in database
const MongoDbStore = require("connect-mongo");

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
  })
  .then(() => {
    console.log("MongoDB connected succesfully..");
  })
  .catch((err) => {
    console.log("Error is ", err);
  });

// Session Config
// for creating session always do the same
//  Store is used for storing the session in database
app.use(
  session({
    secret: myfile.secret,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: db,
    }),
    saveUninitialized: true,
    cookie: {
      //  secure: true
      maxAge: 1000 * 60 * 60 * 24,
      // maxAge: 1000 * 50,
    },
  })
);

// Use flash Middleware
app.use(flash());

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
