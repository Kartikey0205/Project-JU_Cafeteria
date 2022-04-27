function homeController() {
  // Using Factory Method
  return {
    //get home page
    index(req, res) {
      res.render("home");
    },
  };
}

module.exports = homeController;
