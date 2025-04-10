# 🛠️ Movie Rating App (Backend)

This is the backend API for the Movie Rating web application. It handles user authentication, movie rating submissions, and data persistence using MongoDB Atlas.

## 🧰 Technologies Used

- 🧾 **JavaScript** – Backend logic
- ⚡ **Fastify** – Web framework for the API
- 🍃 **MongoDB Atlas** – Cloud-hosted NoSQL database
- 🔐 **JWT** – Secure token-based authentication

## 🌍 Connected Frontend

This backend powers the frontend available at:  
🔗 [https://voluble-pasca-57dd6c.netlify.app/#/signin](https://voluble-pasca-57dd6c.netlify.app/#/signin)

Frontend GitHub repository:  
[https://github.com/Ugo02/App_Web_Dev](https://github.com/Ugo02/App_Web_Dev)


## 📂 Endpoints

```http
POST   /api/auth/signup      → Create a new user
POST   /api/auth/signin      → Authenticate a user and receive a JWT
GET    /api/movies           → Get list of all rated movies (auth required)
POST   /api/movies           → Submit a new movie rating (auth required)
