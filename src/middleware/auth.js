const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error('Invalid token');
        }
        const decodedData = jwt.verify(token, "@DevChatserver1230998&");
        const { _id } = decodedData
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("invalid user");
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(400).send("Error:" + error.message);

    }
}

module.exports = { userAuth, }