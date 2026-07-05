const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { transactions } = require("./db");
const { decrypt } = require("./crypto");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "eglobal-secret";

const USERS = [
  {
    email: "supervisor@test.com",
    password: "password",
    role: "supervisor",
  },
  {
    email: "operator@test.com",
    password: "password",
    role: "operator",
  },
];

const maskCard = (card) => {
  const digits = card.replace(/\D/g, "");
  return `**** **** **** ${digits.slice(-4)}`;
};

const generateApproval = () => Math.floor(100000 + Math.random() * 900000);

const generateReference = () => Math.floor(10000000 + Math.random() * 90000000);

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({
    token,
    email: user.email,
    role: user.role,
  });
});

app.post("/sale", authMiddleware, roleMiddleware("operator"), (req, res) => {
  const { amount, name, cardNumber, expirationDate, cvv } = req.body;

  if (!amount || !name || !cardNumber || !expirationDate || !cvv) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const decryptedCard = decrypt(cardNumber).replace(/\D/g, "");

  const transaction = {
    id: generateReference(),
    email: req.user.email,
    role: req.user.role,

    type: "sale",
    amount,
    name,

    cardNumber: decryptedCard,
    card: maskCard(decryptedCard),

    expirationDate: decrypt(expirationDate),
    cvv: decrypt(cvv),

    approvalNumber: generateApproval(),
    financialReference: generateReference(),

    status: "approved",

    createdAt: new Date(),
  };

  transactions.push(transaction);

  res.json({
    approvalNumber: transaction.approvalNumber,
    financialReference: transaction.financialReference,
    card: transaction.card,
  });
});

app.get("/transactions", authMiddleware, (req, res) => {
  const result =
    req.user.role === "supervisor"
      ? transactions
      : transactions.filter((t) => t.email === req.user.email);

  const maskedTransactions = result.map((transaction) => ({
    id: transaction.id,
    email: transaction.email,
    role: transaction.role,
    type: transaction.type,
    amount: transaction.amount,
    name: transaction.name,
    card: transaction.card,
    approvalNumber: transaction.approvalNumber,
    financialReference: transaction.financialReference,
    status: transaction.status,
    createdAt: transaction.createdAt,
  }));

  res.json(maskedTransactions);
});

app.patch(
  "/transaction",
  authMiddleware,
  roleMiddleware("supervisor"),
  (req, res) => {
    const { financialReference, cardNumber, type } = req.body;

    const decryptedCard = decrypt(cardNumber).replace(/\D/g, "");

    const transaction = transactions.find(
      (t) =>
        t.financialReference == financialReference &&
        t.cardNumber === decryptedCard,
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    transaction.status = type;

    res.json({
      message: "Transaction updated",
      transaction,
    });
  },
);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
