const validator = require('validator');

const validateSignUpdate = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("name is not valid");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("please create a strong password");
    }

};

const validateEditProfileData = (req) => {
    const ALLOWED_EDIT_PROFILE = ["age", "firstName", "lastName", "gender", "email", "photoUrl", "about", "skills"];
    const isEditAllowed = Object.keys(req.body).every((key) => { ALLOWED_EDIT_PROFILE.includes(key) });
    return isEditAllowed;

}

module.exports = { validateSignUpdate, validateEditProfileData };
