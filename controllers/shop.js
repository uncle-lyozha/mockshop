const Product = require("../models/product");
const Order = require("../models/order");

exports.getProductsList = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/product-list",
        isAuthenticated: req.user,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.productID;
  Product.findById(prodID)
    .then(product => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/product-list",
        isAuthenticated: req.user,
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(products => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products.cart.items,
        isAuthenticated: req.user,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect("/cart");
    });
};

exports.postCardDeleteProd = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(products => {
      const items = products.cart.items.map(i => {
        return { products: { ...i.productId._doc }, quantity: i.quantity };
      });

      const amount = items
        .reduce((acc, curr) => acc + curr.products.price * curr.quantity, 0)
        .toFixed(2);

      const order = new Order({
        items: items,
        user: {
          userId: req.user,
        },
        amount: amount,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.user,
      });
    })
    .catch(err => console.log(err));
};
