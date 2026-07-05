# EGlobal Technical Challenge

## Description

This project is a payment gateway simulation developed as part of the EGlobal technical challenge.

The application supports two user roles:

- **Operator**
  - Create sales transactions.

- **Supervisor**
  - Process cancellations and refunds.
  - View all transactions.

Authentication is handled using **JWT**, while sensitive card information is encrypted using **AES** before being sent to the backend.

The backend is a simple Express application that stores data in memory for demonstration purposes.

---

## Technologies

### Frontend

- Vue 3
- TypeScript
- Vite
- Quasar
- Vue Router
- Pinia
- Axios

### Backend

- Node.js
- Express
- JSON Web Token (JWT)
- CryptoJS (AES)

---

## Project Structure

```
.
├── src/
├── server/
└── README.md
```

---

## Node.js Version

This project was developed using **Node.js 22.14.0**.

If you have **NVM** installed, run:

```bash
nvm use
```

Otherwise, make sure you are using **Node.js 22.14.0** (or a compatible Node.js 22.x version) before installing the dependencies.

---

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
npm run setup
```

---

## Run the project

Start the backend:

```bash
npm run server
```

Start the frontend (in a different terminal):

```bash
npm run dev
```

---

## Demo Credentials

### Operator

**Email**

```
operator@eglobal.com
```

**Password**

```
password
```

---

### Supervisor

**Email**

```
supervisor@eglobal.com
```

**Password**

```
password
```
