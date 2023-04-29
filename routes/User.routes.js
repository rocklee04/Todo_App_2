const express = require("express");
const {UserModel} = require("../model/User.model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const userRouter = express.Router();


userRouter.post("/register",async (req, res) => {
    const {email, password, name, age} = req.body
    try {
        bcrypt.hash(password, 5,async (err, hash) => {
            const user = new UserModel({email, name, age, password: hash})
            await user.save();
            res.status(200).send({"msg": "New user has been registered"})
        });
 
    }catch(err) {
        res.status(400).json({"err": err.message})
    }
   
})

userRouter.post("/login",async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await UserModel.findOne({email})
        if(user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if(result) {
                    const token = jwt.sign({authorID: user._id, author: user.name}, 'masai');
                    res.status(200).json({"msg": "Login Successfully", "token": token}) 
                } else {
                    res.status(200).json({"msg": "Wrong Credentials!!"})
                }
            });

        } else {
            res.status(200).json({"msg": "Wrong Credentials!!"})
        }
    }catch(err) {
        res.status(400).json({"err": err.message})
    }
})

module.exports = {
    userRouter
}