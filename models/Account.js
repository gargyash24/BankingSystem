const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    accountNo: { type: String, unique: true },
    holderName: String,
    password: String,
    balance: { type: Number, default: 0 },
    isKYCVerified: Boolean
});

module.exports = mongoose.model("Account", accountSchema);
