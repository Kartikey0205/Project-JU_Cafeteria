// Import model of Menu

const Menu = require("../../models/Menu");

function homeController() {
  return {
    //  home page rendering method
    index(req, res) {
      //can use async await -- make index as async

      // Menu model h aur usme database mein se pizza k menu doondh rhe h toh find query lgaya aur agr pizza milta h toh home page render pizza k sath hi
      Menu.find()
        .then((pizzas) => {
          // console.log(pizzas);
          return res.render("home", {
            pizza: pizzas,
          });
        })
        .catch(() => console.log("Error in finding"));
    },
  };
}

module.exports = homeController;
