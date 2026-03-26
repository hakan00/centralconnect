# CentralConnect - MERN  Project

CentralConnect is a MERN-stack web platform prototype inspired by the thesis **"Design and Implementation of a Centralized Web-Based Service Platform for International Integration and Digital Guidance"**.

## Features

- JWT-based authentication
- Role-aware access (`user`, `admin`)
- Dashboard for foreigners / tourists
- Airport transfer booking module
- Legal guidance / police record request module
- University application tracker
- Digital tourist guide module
- Community posts for social integration
- REST API with modular architecture
- MongoDB models designed for extensibility

## Tech Stack

- **Frontend:** React, React Router, Context API, Axios, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt

## Project Structure

```bash
centralconnect/
  client/
  server/
```

## Quick Start

### 1) Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2) Client

```bash
cd client
npm install
npm run dev
```

## Environment Variables

### server/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/centralconnect
JWT_SECRET=super_secret_change_me
CLIENT_URL=http://localhost:5173
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transfers`
- `POST /api/transfers`
- `GET /api/legal-guides`
- `POST /api/legal-guides/request`
- `GET /api/applications`
- `POST /api/applications`
- `PATCH /api/applications/:id/status`
- `GET /api/tours`
- `POST /api/community`
- `GET /api/community`

## Alignment

This prototype directly maps to the thesis objectives:

- **Administrative and Legal Integration Module**
- **Logistics and Arrival Services Module**
- **Educational and Social Integration Module**
- **Digital Tourist Guide**

