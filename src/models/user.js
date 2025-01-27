const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: 'string',
        required: true,
        minLength: 2,
        maxlength: 30
    },
    lastName: {
        type: 'string',
    },
    email: {
        type: 'string',
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }

        }
    },
    password: {
        type: 'string',
        required: true
    },
    age: {
        type: Number,
        min: 15
    },
    gender: {
        type: 'string',
        validate(value) {
            if (!["male", "female", "Other"].includes(value)) {
                throw new Error("Invalid gender");
            }
        },
    },
    photoUrl: {
        type: "String",
        default: "https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo url address: " + value);
            }

        }

    },
    about: {
        type: "String",
        default: "About me "
    },
    skills: {
        type: [String],
    },

}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({ _id: user._id }, "@DevChatserver1230998&", { expiresIn: "1d", });
    return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashedPassword);
    return isPasswordValid;

}

// const userModel = mongoose.model('User', userSchema)
// or you can use below code for better readablity
module.exports = mongoose.model('User', userSchema);