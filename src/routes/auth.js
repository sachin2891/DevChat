const express = require('express');
const authRouter = express.Router();
const { validateSignUpdate } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpdate(req);
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(405).send("error accure while creating user: " + error.message);
    }



});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.status(200).send("login successfully");
        } else {
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        res.status(405).send("error accure while login " + error.message);
    }
});
authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()) });
    res.send("logout successful")
})


module.exports = authRouter;