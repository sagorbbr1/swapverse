# 🔁 SwapVerse

**SwapVerse** is a MERN stack (MongoDB, Express, React, Node.js) application that enables users to list and swap everyday items with others. It includes features like user authentication, item CRUD, image uploads, swap requests, and real-time one-to-one chat.

## 🚀 Live Demo

- **Frontend**: [https://swapverse-vjn1.vercel.app](https://swapverse-vjn1.vercel.app)
- **Backend**: [https://swapverse-back.vercel.app](https://swapverse-back.vercel.app)

---

## 📂 Project Structure

```
swapverse/
│
├── client/           # React Frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── server/           # Express Backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── socket/
│   └── ...
│
├── .env
└── README.md
```

---

## 🔧 Technologies Used

- **Frontend**: React, React Router, Bootstrap, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Cookie-based auth (JWT)
- **Real-time Chat**: Socket.IO
- **Image Upload**: Multer
- **Hosting**: Vercel (Frontend), Railway/Render/Vercel (Backend)

---

## ✨ Features

- 🔒 User Registration & Login (with secure cookies)
- 📦 Item Creation, Editing, Deletion
- 🖼️ Image Upload & Preview
- 🔍 Search and Filter Items
- 🔁 Send & Manage Swap Requests
- 💬 Real-time 1-to-1 Chat on Swap Acceptance
- 🔐 Protected Routes & Auth Context
- 📱 Fully Responsive UI

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/sagorbbr1/swapverse.git
cd swapverse
```

### 2. Set Up Environment Variables

#### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

#### Frontend (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

## 🧪 Run the App Locally

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd ../client
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push `client` to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repo.
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.vercel.app`
4. Deploy.

### Backend (Render/Railway)

1. Push `server` folder to GitHub (can be separate repo).
2. Deploy on [Render](https://render.com) or [Railway](https://railway.app).
3. Set `.env` variables from above.
4. Enable CORS:

```js
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
```

---

## 📌 Important Notes

- Make sure **CORS settings** are correct on the backend for deployed frontend.
- Use `credentials: "include"` in frontend fetch requests to preserve cookies.
- Keep JWT secret and Mongo URI secure (never push to GitHub).

---

## 🙌 Author

**Mohammad Sagor**  
Frontend & MERN Stack Developer  
📧 [Email](mailto:sagorbbr1@email.com)  
🌐 [LinkedIn](https://linkedin.com/in/sagorbbr1)

---

## 📄 License

This project is licensed under the MIT License.
