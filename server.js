// Express Server required package
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

// Dynamic Port
const PORT = process.env.PORT || 5500;

// Assests for MIME type accrordingly setting Content Type
app.use(express.static("public"));

// set Template Engine
app.use(expressLayouts);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/cart", (req, res) => {
  res.render("customer/cart");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.get("/register", (req, res) => {
  res.render("auth/register");
});
// Listening to server
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
