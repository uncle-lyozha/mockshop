const express = require("express");
const path = require("path");

const isAuth = require("../middleware/is-auth");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/product-list", shopController.getProductsList);

router.get("/products/:productID", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCardDeleteProd);

router.post("/create-order", isAuth, shopController.postOrder);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
