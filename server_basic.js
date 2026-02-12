const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

/*
Data Model
accountNo
holderName
balance
isKYCVerified
*/

let accounts = [];

// Helper: find account
function getAccount(accNo) {
    return accounts.find(a => a.accountNo === accNo);
}

/* ---------------- CREATE ACCOUNT ---------------- */
app.post("/createAccount", (req, res) => {
    const { accountNo, holderName, isKYCVerified } = req.body;

    if (getAccount(accountNo))
        return res.json({ error: "Account already exists" });

    accounts.push({
        accountNo,
        holderName,
        balance: 0,
        isKYCVerified
    });

    res.json({ message: "Account created successfully" });
});

/* ---------------- DEPOSIT ---------------- */
app.post("/deposit", (req, res) => {
    const { accountNo, amount } = req.body;
    const acc = getAccount(accountNo);

    if (!acc) return res.json({ error: "Account not found" });

    acc.balance += amount;
    res.json({ message: "Deposit successful", balance: acc.balance });
});

/* ---------------- WITHDRAW ---------------- */
app.post("/withdraw", (req, res) => {
    const { accountNo, amount } = req.body;
    const acc = getAccount(accountNo);

    if (!acc) return res.json({ error: "Account not found" });

    if (acc.balance < amount)
        return res.json({ error: "Insufficient balance" });

    acc.balance -= amount;
    res.json({ message: "Withdrawal successful", balance: acc.balance });
});

/* ---------------- TRANSFER ---------------- */
app.post("/transfer", (req, res) => {
    const { senderAccount, receiverAccount, amount } = req.body;

    const sender = getAccount(senderAccount);
    const receiver = getAccount(receiverAccount);

    if (!sender || !receiver)
        return res.json({ error: "Invalid account" });

    if (!sender.isKYCVerified)
        return res.json({ error: "Sender KYC not verified" });

    if (sender.balance < amount)
        return res.json({ error: "Insufficient balance" });

    sender.balance -= amount;
    receiver.balance += amount;

    res.json({ message: "Transfer successful" });
});

/* ---------------- ACCOUNT LIST ---------------- */
app.get("/accounts", (req, res) => {
    res.json(accounts);
});

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);