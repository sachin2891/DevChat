const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionsRequest = require('../models/connectionsRequest');
const User = require('../models/user');
const userRoutes = express.Router();

const SAFE_CONNECTIONS_DATA = ["firstName", "lastName", "age", "gender", "about", "skills"];
userRoutes.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionsRequest.findOne({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", SAFE_CONNECTIONS_DATA);
        res.json({ message: "Data fetched successfully", data: connectionRequest });
    } catch (error) {
        res.status(400).send("Error " + error.message);

    }
}
);
userRoutes.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionsRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" }, { fromUserId: loggedInUser._id, status: "accepted" }]

        }).populate("fromUserId", SAFE_CONNECTIONS_DATA).populate("toUserId", SAFE_CONNECTIONS_DATA);
        const data = connectionRequest.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        }

        )
        res.json(data);
    } catch (error) {
        res.status(400).send("Error " + error.message);

    }
});

userRoutes.get("/feed", userAuth, async (req, res) => {

    try {
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionsRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());

        });
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select(SAFE_CONNECTIONS_DATA).skip(skip).limit(limit);

        res.send(users);

    } catch (error) {
        res.status(400).send("Error " + error.message);

    }

})

module.exports = userRoutes;