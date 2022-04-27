function cartController() {
  // Using Factory Method
  return {
    // get cart page
    index(req, res) {
      res.render("customer/cart");
    },
  };
}

module.exports = cartController;
