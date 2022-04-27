const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customer/cartController");

function initRoutes(app) {
  /*
  @type       -     GET
  @route      -     /
  @desc       -     route for HOME PAGE  of user
  @access     -     PUBLIC
  */
  app.get("/", homeController().index);

  /*
  @type       -     GET
  @route      -     /cart
  @desc       -     route for CART PAGE  of user
  @access     -     PUBLIC
  */

  app.get("/cart", cartController().index);
  /*
  @type       -     GET
  @route      -     /login
  @desc       -     route for LOGIN PAGE  of user
  @access     -     PUBLIC
  @middleware -     guest
  */
  app.get("/login", authController().login);

  /*
  @type       -     GET
  @route      -     /register
  @desc       -     route for REGISTER PAGE  of user
  @access     -     PUBLIC
  @middleware -     guest
  */

  app.get("/register", authController().register);
}

module.exports = initRoutes;
