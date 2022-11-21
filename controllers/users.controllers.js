const users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const signUP = async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let contact = req.body.contactNumber;
    let password = req.body.password;

    let usersData = await users.find({email: email});

    if (usersData.length > 0) {
        res.status(200).send("Try any other email, this email is already registered!");
    }
    else {
        let emailSplit = email.split(".");
        let part1 = emailSplit[0].split("@")[0];
        let part2 = emailSplit[0].split("@")[1]
        let part3 = emailSplit[1];
        let letters = /^[a-z]+$/;

        let part3Check = false
        if (part3.match(letters)) {
            part3Check = true;
        }

        if (part1 < 1 || part2 < 1 || (part3 < 2 || part3 > 6) || !part3Check) {
            res.status(200).send("Invalid email-id format!");
            return;
        }

        if (isNaN(contact) || contact.length != 10) {
            res.status(200).send("Invalid contact number!");
            return;
        }

        await users.create({
            createdAt: Date.now(),
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: bcrypt.hashSync(password, 10),
            phone_number: Number.parseInt(contact),
            role: "admin",
            updatedAt: Date.now(),
        }).then((user) => {
            res.status(200).send(user);
        })
    }
}

const login = async (req, res) => {
    let email = req.params.email;
    let password = req.params.password;

    let usersData = await users.find({email: email});

    if (usersData.length == 0) {
        res.status(200).send("This email has not been registered!");
    }
    else {
        let hashPassword = usersData[0].password;

        if (!bcrypt.compareSync(password, hashPassword)) {
            res.status(200).send("Invalid Credentials!");
        }
        else {
            const token = jwt.sign({ _id: usersData[0]._id }, 'myprivatekey');
            res.status(200).header("x-access-token", token).send({
                "email": usersData[0].email,
                "name": usersData[0].first_name + " " + usersData[0].last_name,
                "isAuthenticated": true,
            });
        }
    }
}

module.exports = {signUP, login};