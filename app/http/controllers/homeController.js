// import Menu

const Menu = require("../../models/menu");

function homeController() {
  // Using Factory Method
  return {
    //get home page
    async index(req, res) {
      const allMenus = await Menu.find();

      // console.log(allMenus);
      return res.render("home", {
        allMenus: allMenus,
      });
    },
  };
}

module.exports = homeController;
