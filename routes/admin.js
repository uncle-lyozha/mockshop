const express = require("express");
const path = require("path");

const adminController = require("../controllers/admin");

const isAuth = require('../middleware/is-auth')

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProductsPage);

router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
