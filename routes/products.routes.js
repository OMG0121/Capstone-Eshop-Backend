const express = require("express");
const {searchProducts, getProductsCategories, getProductByProductId, saveProducts, updateProductDetails, deleteProduct} = require("../controllers/products.controllers");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/products", searchProducts);

router.get("/products/categories", getProductsCategories);

router.get("/products/:id", getProductByProductId);

router.post("/products", auth, saveProducts);

router.put("/products/:id", auth, updateProductDetails);

router.delete("/products/:id", auth, deleteProduct);

module.exports = router;