import axios from "axios";
import Noty from "noty";
import moment from "moment";

import { initAdmin } from "./admin";

// Swipper Js cODE

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 30,
  autoplay: {
    delay: 2500,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// console.log("hello");
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.getElementById("cartCounter");

// cart mein update krne wala pizza aur session mein cart ko store krne k liye yhn p hm axios libraray use krenge
const updateCart = (pizza) => {
  // ajax call

  // hme data bhejna h toh post request
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      console.log("Response is ", res);
      cartCounter.innerText = res.data.totalQty;

      // message show kr rhe h
      new Noty({
        type: "success",
        timeout: 1200, //after this milisecond it hide
        text: "Item Added to Cart!",
        progressBar: false,
        // layout: "bottomRight",
      }).show();
    })
    .catch((err) => {
      // console.log("Error in axios fetch")
      new Noty({
        type: "error",
        timeout: 1500,
        text: "Something goes Wrong!",
        progressBar: false,
        // layout: "bottomRight",
      }).show();
    });
};

//  Adding button p menu k event listener lga rhe h kuki hmne query All ki that means ki array of object mil jayega hme so use loop through kr skte h
addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // console.log(e);
    // button p data attribute k zariye hm log current pizza ko string m change krke yhn p bhej rhe h aur yhn p wps string ko parse krenge object mein
    let pizza = JSON.parse(btn.dataset.pizza);
    // server p request bhejen k function h update cart or apne cart ko store krwayenge session mein
    updateCart(pizza);
    // console.log(pizza);
  });
});

// Remove Order alert message after 2 seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change order status
let statuses = document.querySelectorAll(".status_line");

let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
// console.log(order); database order for that particular id

//  cretaing small tag from JS

let time = document.createElement("small");
function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current-status");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current-status");
      }
    }
  });
}

updateStatus(order);

//  Socket client side

let socket = io(); // y io hmko script se mil rhi h layout k
// Join --> jaise hi hm Order page p chlenge waise ji hmko server ko btana h ki bhai hm order page p aa gye h aur y lo order id aur iske name se ek room bna do aur isko join kr do

// Calling admin side order details function

if (order) {
  socket.emit("join", `order_${order._id}`);
}

// Admin side Real Time

let adminAreaPath = window.location.pathname;
// console.log(adminAreaPath);
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);

  socket.emit("join", "adminRoom");
}

// Client Side Real Time
socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  // console.log(updatedOrder);
  updateStatus(updatedOrder);

  // message show kr rhe h
  new Noty({
    type: "success",
    timeout: 1200, //after this milisecond it hide
    text: "Order Updated!",
    progressBar: false,
    // layout: "bottomRight",
  }).show();
});
