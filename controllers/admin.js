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
  Product.create({
    title: title,
    imageUrl: imageURL,
    price: price,
    description: description,
  })
    .then(result => {
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
  Product.findByPk(prodID)
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
  const prodID = req.body.productID;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;
  Product.findByPk(prodID)
    .then(product => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageURL;
      product.description = updatedDesc;
      product.price = updatedPrice;
      return product.save();
    })
    .then(result => {
      console.log("Product Updated");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
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
  const prodID = req.body.productID;
  Product.findByPk(prodID)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      console.log("Product Destroyed");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
  // Product.destroy({ where: { id: prodID } })
  //   .then(result => {
  //     res.redirect("/admin/products");
  //   })
  //   .catch(err => console.log(err));
};
