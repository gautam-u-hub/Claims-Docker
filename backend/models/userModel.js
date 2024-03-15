const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");



function validatePhoneNumber(phoneNumber) {
    return /^\d{10}$/.test(phoneNumber);
}
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [2, "Name should have more than 2 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]

    },
    password: {
        type: String,
        required: [true, "Please Enter Your Passowrd"],
        minLength: [8, "Password should have more than 8 characters"],
        select: false

    },

    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },

    role: {
        type: String,
        default: 'policyHolder',
    },
    


    phoneNumber: {
        type: String,
        validate: [validatePhoneNumber, 'Invalid phone number']
    },

    policies: [{
        policy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Policy'
        },
        leftAmount: {
            type: Number,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date
        },
        lastPremiumPayment: {
            type: Date,
        }

    }],

    resetPasswordToken: String,
    resetPasswordExpire: Date,

})


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}



userSchema.methods.getResetPasswordToken = function () {


    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;


}


module.exports = mongoose.model("User", userSchema);

