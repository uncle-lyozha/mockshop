const { ObjectId } = require("mongodb");
const Product = require("../models/product");

exports.getAddProductsPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    imageUrl: imageURL,
    price: price,
    description: description,
    userId: req.session.user,
  });
  product
    .save()
    .then(() => {
      console.log("New Product Created!");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
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

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageURL;
      product.description = updatedDesc;
      product.price = updatedPrice;
      return product.save();
    })
    .then(() => {
      console.log("Product Updated");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
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
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};
