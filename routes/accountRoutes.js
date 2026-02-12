const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE ACCOUNT */
router.post("/createAccount", async (req, res) => {
    const { accountNo, holderName, password, isKYCVerified } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await Account.create({
        accountNo,
        holderName,
        password: hash,
        isKYCVerified
    });

    res.json({ message: "Account created" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
    const { accountNo, password } = req.body;

    const acc = await Account.findOne({ accountNo });
    if (!acc) return res.json({ error: "Account not found" });

    const valid = await bcrypt.compare(password, acc.password);
    if (!valid) return res.json({ error: "Wrong password" });

    const token = jwt.sign(
        { accountNo },
        process.env.JWT_SECRET
    );

    res.json({ token });
});

/* DEPOSIT */
router.post("/deposit", auth, async (req, res) => {
    const { amount } = req.body;

    const acc = await Account.findOne({ accountNo: req.user.accountNo });

    acc.balance += amount;
    await acc.save();

    await Transaction.create({
        type: "deposit",
        receiver: acc.accountNo,
        amount
    });

    res.json({ balance: acc.balance });
});

/* TRANSFER */
router.post("/transfer", auth, async (req, res) => {
    const { receiverAccount, amount } = req.body;

    const sender = await Account.findOne({ accountNo: req.user.accountNo });
    const receiver = await Account.findOne({ accountNo: receiverAccount });

    if (!sender.isKYCVerified)
        return res.json({ error: "KYC required" });

    if (sender.balance < amount)
        return res.json({ error: "Insufficient balance" });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    await Transaction.create({
        type: "transfer",
        sender: sender.accountNo,
        receiver: receiver.accountNo,
        amount
    });

    res.json({ message: "Transfer successful" });
});

/* TRANSACTION HISTORY */
router.get("/transactions", auth, async (req, res) => {
    const acc = req.user.accountNo;

    const history = await Transaction.find({
        $or: [{ sender: acc }, { receiver: acc }]
    });

    res.json(history);
});

/* WITHDRAW */
router.post("/withdraw", auth, async (req, res) => {
    const { amount } = req.body;

    const acc = await Account.findOne({
        accountNo: req.user.accountNo
    });

    if (acc.balance < amount)
        return res.json({ error: "Insufficient balance" });

    acc.balance -= amount;
    await acc.save();

    await Transaction.create({
        type: "withdraw",
        sender: acc.accountNo,
        amount
    });

    res.json({ balance: acc.balance });
});


/* ACCOUNT BALANCE */
router.get("/balance", auth, async (req, res) => {
    const acc = await Account.findOne(
        { accountNo: req.user.accountNo },
        "accountNo holderName balance"
    );

    res.json(acc);
});


/* ADMIN - ALL ACCOUNTS */
router.get("/admin/accounts", async (req, res) => {
    const accounts = await Account.find({}, "-password");
    res.json(accounts);
});

/* ADMIN - ALL TRANSACTIONS */
router.get("/admin/transactions", async (req, res) => {
    const txns = await Transaction.find().sort({ date: -1 });
    res.json(txns);
});


module.exports = router;
