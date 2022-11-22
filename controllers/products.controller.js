const products = require('../models/products.model');
const users = require("../models/users.model");


const searchProducts = async (req, res) => {
    let category = req.query.category;
    let direction = req.query.direction;
    let name = req.query.name;
    let sort = req.query.sort;

    if (direction == "ASC") {
        direction = 1;
    }
    else {
        direction = -1;
    }

    if (sort == undefined) {
        sort = "_id";
    }

    let filter = {}
    filter[sort] = direction;

    if (category == undefined && name == undefined) {
        await products.find().sort(filter)
    .then((data) => {
        res.status(200).send(data);
        return;
    })
    .catch((err) => {
        res.status(401).send(err);
        return;
    })
    }
    else {
        if (category == undefined) {
            category = "";
        }
    
        if (name == undefined) {
            name = "";
        }
    
        await products.find({$or: [{category: category}, {name: name}]}).sort(filter)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(401).send(err);
        })
    }

    
}

const getProductsCategories = async (req, res) => {
    await products.find()
    .then((data) => {
        let categories = [];

        for (let i=0; i<data.length; i++) {
            if (!categories.includes(data[i].category)) {
                categories.push(data[i].category);
            }
        }

        res.status(200).send(categories);
    }).catch((err) => {
        res.status(400).send(err);
    })
}

const getProductByProductId = async (req, res) => {
    let id = req.params.id;

    let productsData = [];

    try {productsData = await products.find({_id: id})}
    catch(err) {
        res.status(200).send(`No Product found for ID - ${id}!`);
        return;
    }

    res.status(200).send(productsData);

}

const saveProducts = async (req, res) => {
    let token = req.headers["x-access-token"];
    let name = req.body.name;
    let availableItems = req.body.availableItems;
    let price = req.body.price;
    let category = req.body.category;
    let description = req.body.description;
    let imageURL = req.body.imageURL;
    let manufacturer = req.body.manufacturer;

    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send("Please Login first to access this endpoint!");
        return;
    }

    if (userData[0].role != "admin") {
        res.status(403).send("You are not authorized to access this endpoint!");
        return;
    }

    await products.create({
        name: name,
        category: category,
        manufacturer: manufacturer,
        availableItems: Number.parseInt(availableItems),
        price: Number.parseInt(price),
        imageURL: imageURL,
        description: description,
        updateAt: Date.now(),
        createdAt: Date.now()
    }).then((data) => {
        res.status(200).send({"data":data, "status": "success"});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
}

const updateProductDetails = async (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let availableItems = req.body.availableItems;
    let price = req.body.price;
    let category = req.body.category;
    let description = req.body.description;
    let imageURL = req.body.imageURL;
    let manufacturer = req.body.manufacturer;
    let token = req.headers["x-access-token"];
    
    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send("Please Login first to access this endpoint!");
        return;
    }

    if (userData[0].role != "admin") {
        res.status(403).send("You are not authorized to access this endpoint!");
        return;
    }

    try {await products.find({_id: id})}
    catch(err) {
        res.status(200).send(`No Product found for ID - ${id}!`);
        return;
    }

    await products.findOneAndUpdate({_id: id}, {
        name: name,
        category: category,
        manufacturer: manufacturer,
        availableItems: Number.parseInt(availableItems),
        price: Number.parseInt(price),
        imageURL: imageURL,
        description: description,
        updateAt: Date.now()
    }).then((data) => {
        res.status(200).send({"data":data, "status": "success"});
    }).catch((err) => {
        res.status(400).send(err);
    })

}

const deleteProduct = async(req, res) => {
    let id = req.params.id;
    let token = req.headers["x-access-token"];
    
    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send("Please Login first to access this endpoint!");
        return;
    }

    if (userData[0].role != "admin") {
        res.status(403).send("You are not authorized to access this endpoint!");
        return;
    }

    try {await products.find({_id: id})}
    catch(err) {
        res.status(200).send(`No Product found for ID - ${id}!`);
        return;
    }

    await products.findOneAndDelete({_id: id})
    .then(() => {
        res.status(200).send({"description":`Product with ID - ${id} deleted successfully!`, "status": "success"});
    }).catch((err) => {
        res.status(400).send(err);
    })
    
}

module.exports = {searchProducts, getProductsCategories, getProductByProductId, saveProducts, updateProductDetails, deleteProduct};