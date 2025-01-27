
const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');

profileRouter.get('/profile/view', userAuth, async (req, res) => {


    try {

        const user = req.user;
        res.status(200).send(user);
    } catch (error) {
        res.status(405).send("error accured " + error.message);
    }
});
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

    try {
        if (!validateEditProfileData(req));
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => { loggedInUser[key] = req.body[key] });
        await loggedInUser.save();
        res.status(200).json({ message: `${loggedInUser.firstName} You have updated your Profile`, data: loggedInUser });



    } catch (error) {

    }
}
);
profileRouter.patch('/profile/password', userAuth, async (req, res) => {


    try {
        const { password, newPassword } = req.body;
        const loggedInUser = req.user;
        const isValidPassword = await loggedInUser.validatePassword(password);
        if (!isValidPassword) {
            throw new Error('invalid password');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        console.log(loggedInUser.password);
        loggedInUser.save();
        res.status(201).send("password has been changed successfully");

    } catch (error) {
        res.send("There is an issue while " + error.message)
    }
})

module.exports = profileRouter;