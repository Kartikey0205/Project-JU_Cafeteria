// dot env file ko require kiya h
require("dotenv").config();

// sari depedencies require
const express = require("express"); // for express server
const ejs = require("ejs"); // templating engines
const expressLayout = require("express-ejs-layouts"); // common layout isme jayega with layout.ejs file name
const path = require("path"); // path to join two file-directory

// Database stuff
const mongoose = require("mongoose");
// for creting session in express we need this
const session = require("express-session");
//  express-flash is used to define a flash message and render it without rendering the request
const flash = require("express-flash");
// connect-mongo is used to store session in database
const MongoDbStore = require("connect-mongo");
const passport = require("passport");

const Emitter = require("events");

const myfile = require("./setup/myFile");

const app = express();
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

// EVENT EMITTER

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// Session Config middleware

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
    },
  })
);

const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// using express-flash as a middleware
app.use(flash());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.use((req, res) => {
  res.status(404).send(`<h1 style="text-align: center;
  margin:2rem;">Oops! Page Not Found</h1>`);
});

// listening port
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  // Join
  socket.on("join", (roomName) => {
    socket.join(roomName);
  });
});

// client side Emitter
eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});

// Admin side Emitter

eventEmitter.on("orderPlaced", (data) => {
  io.to(`adminRoom`).emit("orderPlaced", data);
});
