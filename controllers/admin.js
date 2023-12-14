const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProductsPage = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    validationErrors: [],
    errorMessage: message,
    oldInput: {
      title: "",
      imageURL: "",
      price: "",
      description: "",
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const valErrors = validationResult(req);

  if (!valErrors.isEmpty()) {
    console.log(valErrors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Add product",
      editing: false,
      hasError: true,
      errorMessage: valErrors.array()[0].msg,
      oldInput: {
        title: title,
        imageURL: imageURL,
        price: price,
        description: description,
      },
      validationErrors: valErrors.array(),
    });
  }

  const product = new Product({
    title: title,
    imageUrl: imageURL,
    price: price,
    description: description,
    userId: req.session.user,
  });
  product
    .save()
    .then(product => {
      console.log("New Product Created!");
      console.log(product);
      res.redirect("/admin/products");
    })
    .catch(err => {
      return res.status(500).render("admin/edit-product", {
        path: "/admin/add-product",
        pageTitle: "Add product",
        editing: false,
        hasError: true,
        errorMessage: 'Database operation failed, please try again.',
        oldInput: {
          title: title,
          imageURL: imageURL,
          price: price,
          description: description,
        },
        validationErrors: [],
      });
    });
};

exports.getEditProduct = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodID = req.params.productID;

  Product.findById(prodID)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        validationErrors: [],
        errorMessage: message,
        oldInput: {
          title: "",
          imageURL: "",
          price: "",
          description: "",
        },
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;
  const valErrors = validationResult(req);

  if (!valErrors.isEmpty()) {
    console.log(valErrors.array());
    return res.status(422).render("admin/edit-product", {
      path: "/admin/add-product",
      pageTitle: "Edit product",
      editing: false,
      hasError: true,
      errorMessage: valErrors.array()[0].msg,
      oldInput: {
        title: updatedTitle,
        imageURL: updatedImageURL,
        price: updatedPrice,
        description: updatedDesc,
      },
      validationErrors: valErrors.array(),
    });
  }
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.imageUrl = updatedImageURL;
      product.description = updatedDesc;
      product.price = updatedPrice;
      return product.save().then(() => {
        console.log("Product Updated");
        res.redirect("/admin/products");
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(product => {
      console.log(`Product Destroyed: \n ${product}`);
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
