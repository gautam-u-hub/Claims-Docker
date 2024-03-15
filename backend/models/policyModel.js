const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
    policyType: {
        type: String,
        required: [true, "Please enter policy type"]
    },
    premiumAmount: {
        type: Number,
        required: [true, "Please enter premium amount"],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: "Premium amount must be greater than zero"
        }
    },
    sumAssured: {
        type: Number,
        required: [true, "Please enter sum assured"],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: "Sum assured must be greater than zero"
        }
    },
    termsAndConditions: {
        type: String,
    },
    policyTerm: {
        type: Number,
        required: [true, "Please enter policy term"],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: "Policy term must be greater than zero"
        }
    },
    paymentFrequency: {
        type: String,
        required: [true, "Please enter payment frequency"],
    },
    lastPaymentDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value <= new Date(); // Check if lastPaymentDate is not greater than today's date
            },
            message: "Last payment date cannot be greater than today's date"
        }
    }
});

module.exports = mongoose.model("Policy", policySchema);
