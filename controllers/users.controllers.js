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
        res.status(200).send({"status":"Try any other email, this email is already registered!"});
    }
    else {
        let emailSplit = email.split(".");
        let part1 = emailSplit[0].split("@")[0];
        let part2 = emailSplit[0].split("@")[1]
        let part3 = emailSplit[1];

        if (part1 == undefined || part2 == undefined || part3 == undefined) {
            res.status(200).send({"status":"Invalid email-id format!"});
            return;
        }

        let letters = /^[a-z]+$/;

        let part3Check = false;


        if (part3.match(letters)) {
            part3Check = true;
        }
    

        if (part1 < 1 || part2 < 1 || (part3 < 2 || part3 > 6) || !part3Check) {
            res.status(200).send({"status":"Invalid email-id format!"});
            return;
        }

        if (isNaN(contact) || contact.length != 10) {
            res.status(200).send({"status":"Invalid contact number!"});
            return;
        }

        await users.create({
            createdAt: Date.now(),
            email: email,
            first_name: firstName,
            last_name: lastName,
            password: bcrypt.hashSync(password, 10),
            phone_number: Number.parseInt(contact),
            role: "user",
            updatedAt: Date.now(),
        }).then((user) => {
            res.status(200).send({"user":user, "status":"Registration Successfull!"});
        })
    }
}

const login = async (req, res) => {
    let email = req.params.email;
    let password = req.params.password;

    let usersData = await users.find({email: email});

    if (usersData.length == 0) {
        res.status(200).send({
            "status": "This email has not been registered!",
            "isAuthenticated": false,
    });
    }
    else {
        let hashPassword = usersData[0].password;

        if (!bcrypt.compareSync(password, hashPassword)) {
            res.status(200).send({
                "status": "Invalid Credentials!",
                "isAuthenticated": false,
        });
        }
        else {
            const token = jwt.sign({ _id: usersData[0]._id }, 'myprivatekey');
            await users.findOneAndUpdate({email: email}, {token: token, updatedAt: Date.now()})
            .then((user) => {
                res.status(200).header("x-access-token", token).send({
                    "email": user.email,
                    "name": user.first_name + " " + user.last_name,
                    "isAuthenticated": true,
                    "role": user.role,
                    "token": token
                });
            })
            .catch((err) => {
                res.status(200).send({
                    "status": "Invalid Credentials!",
                    "isAuthenticated": false,
            });
            })
        }
    }
}


const logout = async (req, res) => {
    let token = req.headers["x-access-token"];

    let userData = await users.find({token: token});

    if (userData.length == 0) {
        res.status(401).send({"status": "Please Login first to access this endpoint!"});
        return;
    }

    users.findOneAndUpdate({token: token}, {token: "", updatedAt: Date.now()})
    .then(() => {
        res.status(200).send({"status": "Logout Successfull", "isAuthenticated": false,});
    }).catch((err) => {
        res.status(200).send({"status": "Logout Unsuccessfull"});
    });
}

module.exports = {signUP, login, logout};