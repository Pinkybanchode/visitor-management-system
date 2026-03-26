const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "security", "employee"],
        default: "employee"
    }
}, { timestamps: true });

userSchema.statics.register = async function (name, email, password, role) {
    if(!validator.isEmail(email)){
        throw Error("Email is Invalid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong")
    }
    const exists = await this.findOne({ email });
    if (exists){
        throw Error("Email already exists")
    }

    const hash = await bcrypt.hash(password, 10);
    console.log("comming here")
    const user = await this.create({ name, email, password: hash, role });
    console.log("user created", user);
    return user;
}
userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email });
    if (!user)
        throw Error("Email doesn't exists")
    

    const match = await bcrypt.compare(password, user.password);
    if(!match)
        throw Error("Incorrect Password");

    return user;
}

module.exports = mongoose.model("User", userSchema);