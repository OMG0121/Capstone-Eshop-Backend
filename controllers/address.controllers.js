const address = require('../models/address.model');
const users = require("../models/users.model");

const addAddress = async (req, res) => {
    let token = req.headers["x-access-token"];
    console.log(req.headers["x-access-token"]);
    let zipcode = req.body.zipcode;
    let state = req.body.state;
    let street = req.body.street;
    let landmark = req.body.landmark;
    let city = req.body.city;
    let contactNumber = req.body.contactNumber;
    let name = req.body.name;
    console.log(req.body);

    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send("Please Login first to access this endpoint!");
        return;
    }

    if (isNaN(zipcode) || zipcode.length != 6) {
        res.status(200).send("Invalid zip code!");
        return;
    }

    if (isNaN(contactNumber) || contactNumber.length != 10) {
        res.status(200).send("Invalid contact number!");
        return;
    }
    
    if (landmark == undefined) {
        landmark = "";
    }

    await address.create({
        name: name,
        city: city,
        state: state,
        street: street,
        contactNumber: contactNumber,
        landmark: landmark,
        zipCode: zipcode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        user: userData[0]
    }).then((data) => {
        res.status(200).send(data);
    })
    .catch((err) => {
        res.status(400).send(err);
        console.log(err);
    })

}

module.exports = {addAddress};