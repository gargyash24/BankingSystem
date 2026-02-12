# 🏦 Banking System Web Application

A full-stack banking system that allows users to create accounts, perform secure transactions, and manage banking operations with an admin monitoring panel.

This project demonstrates transaction validation, authentication, and UI-based banking workflows.

---

## 🚀 Features

### User Features
- Create bank account
- Login with authentication (JWT)
- Deposit money
- Withdraw money
- Transfer money
- View account balance
- View transaction history

### Admin Features
- View all accounts
- View all transactions
- Monitor transfers and balances

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt password hashing

### Frontend
- HTML
- CSS
- JavaScript

### Tools
- Git & GitHub
- MongoDB

---

## 📂 Project Structure

banking-system/
│
├── middleware/
│ └── auth.js
│
├── models/
│ ├── Account.js
│ └── Transaction.js
│
├── routes/
│ └── accountRoutes.js
│
├── public/
│ ├── index.html
│ └── admin.html
│
├── server.js
├── package.json
└── .env


---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/BankingSystem.git
cd BankingSystem
2. Install Dependencies
npm install

3. Setup Environment Variables

Create .env file:

MONGO_URI=mongodb://127.0.0.1:27017/bankDB
JWT_SECRET=secret123
PORT=3000

4. Start Server
node server.js


Open in browser:

http://localhost:3000


Admin panel:

http://localhost:3000/admin.html