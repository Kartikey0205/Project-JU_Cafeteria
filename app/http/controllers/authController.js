function authController() {
  // Using Factory Method
  return {
    // get login page
    login(req, res) {
      res.render("auth/login");
    },

    // get Register page

    register(req, res) {
      res.render("auth/register");
    },
  };
}

module.exports = authController;
