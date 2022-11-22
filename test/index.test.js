const app = require('../server');
const db = require('../config/db.config');
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");

db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() => {
    console.log("Connected to the database!");
})
.catch(err => {
    console.log("Cannot connect to the database!", err);
});

chai.should();
chai.use(chaiHttp);

let email = "omkar@email.com";
let password = "omkar";
let productId = "62406afd75d960b51adb86e1";

const loginCheck = async () => {
    chai.request(app).post(`/auth/${email}/${password}`)
    .end((err, res) => {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        console.log("Login API testing successfull");
    })
};

loginCheck();

const productsCategoriesCheck = async () => {
    chai.request(app).get("/products/categories")
    .end((err, res) => {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        console.log("Product Categories testing API Successfull");
    })
};

productsCategoriesCheck();

const searchProducts = async () => {
    chai.request(app).get("/products")
    .end((err, res) => {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        console.log("Product Search testing API Successfull");
    })
};

searchProducts();

const getProductsById = async () => {
    chai.request(app).get(`/products/${productId}`)
    .end((err, res) => {
        if (err) return console.log(err);
        expect(res).to.have.status(200);
        console.log("Get Product By Id testing API Successfull");
    })
};

getProductsById();