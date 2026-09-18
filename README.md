# Omni Backend

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/omni-back)
[![Code Quality](https://qlty.sh/badges/your-project-id.svg)](https://qlty.sh/projects/your-project-id)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Real-time tweet-like API with Server-Sent Events (SSE), built for serverless deployment on Vercel.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [SSE Client Example](#-sse-client-example)

---

## 🛠 Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | LTS (20.x) | JavaScript runtime |
| **Framework** | Express | 4.18.x | Web framework |
| **Database** | MongoDB | 7.x | NoSQL database |
| **ODM** | Mongoose | 8.x | MongoDB object modeling |
| **Real-time** | Native SSE | Built-in | Server-Sent Events (no Socket.io) |
| **CORS** | cors | 2.8.x | Cross-origin resource sharing |
| **Deployment** | Vercel / Docker | - | Serverless & Container |

---

## 🏗 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Vercel /   │────▶│  MongoDB    │
│  (Browser)  │     │  Docker     │     │  (Atlas/    │
└─────────────┘     └──────┬──────┘     │   Local)    │
                           │            └─────────────┘
                    ┌──────▼──────┐
                    │  Express    │
                    │   App       │
                    │  + SSE      │
                    └─────────────┘
```

**Data Flow:**
1. Client connects to `/events` via `EventSource` (SSE)
2. Client creates tweets via `POST /tweets`
3. Server broadcasts `tweet` event to all SSE connections
4. Client likes tweets via `POST /likes/:id`
5. Server broadcasts `like` event to all SSE connections

---

## 📁 Project Structure

```
omni-back/
├── src/
│   ├── index.js              # App entry point (exports Express app)
│   ├── routes.js             # Route definitions
│   ├── config/
│   │   └── db.js             # Lazy MongoDB connection (serverless-ready)
│   ├── utils/
│   │   └── sseManager.js     # SSE connection manager & broadcaster
│   ├── controllers/
│   │   ├── tweetController.js
│   │   └── likeController.js
│   └── models/
│       └── tweet.js          # Mongoose schema
├── Dockerfile                # Multi-stage Docker build
├── docker-compose.yml        # Local development with MongoDB
├── vercel.json               # Vercel serverless configuration
├── .dockerignore             # Docker build exclusions
├── .vercelignore             # Vercel deploy exclusions
├── package.json
└── README.md
```

---

## 🚀 API Endpoints

### Tweets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tweets` | List all tweets (sorted by newest) |
| `POST` | `/tweets` | Create new tweet |

**Create Tweet Request:**
```json
POST /tweets
Content-Type: application/json

{
  "author": "John Doe",
  "content": "Hello, Omni!"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64f...",
  "author": "John Doe",
  "content": "Hello, Omni!",
  "likes": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Likes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/likes/:id` | Increment like count on tweet |

**Response:** `200 OK` (updated tweet object)

### Server-Sent Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/events` | SSE stream for real-time updates |

**Event Types:**
- `tweet` — New tweet created
- `like` — Tweet liked (updated tweet object)

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint for Docker/load balancers |

---

## 🏁 Getting Started

### Prerequisites
- Node.js LTS (20.x+)
- Docker & Docker Compose (optional)
- MongoDB Atlas account or local MongoDB

---

### Docker Compose (Recommended for Local Dev)

```bash
# Start app + MongoDB
docker-compose up --build

# App: http://localhost:3000
# MongoDB: mongodb://localhost:27017
```

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_OMNI_BACK` | ✅ | - | MongoDB connection string |
| `PORT` | ❌ | `3000` | HTTP server port |
| `NODE_ENV` | ❌ | `development` | Environment mode |

**Example `.env`:**
```env
MONGO_OMNI_BACK=mongodb://localhost:27017/omni
PORT=3000
NODE_ENV=development
```

---

## 📦 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon src/index.js` | Development with hot reload |
| `npm start` | `node src/index.js` | Production start |
| `npm run docker:dev` | `docker-compose up --build` | Start dev environment |
| `npm run vercel:deploy` | `vercel --prod` | Deploy to Vercel |

---

## 💻 SSE Client Example

### Vanilla JavaScript
```javascript
const eventSource = new EventSource('/events');

eventSource.addEventListener('tweet', (event) => {
  const tweet = JSON.parse(event.data);
  console.log('New tweet:', tweet);
  // Update UI
});

eventSource.addEventListener('like', (event) => {
  const tweet = JSON.parse(event.data);
  console.log('Tweet liked:', tweet);
  // Update like count in UI
});

eventSource.onerror = () => {
  console.log('SSE connection lost, reconnecting...');
  // EventSource auto-reconnects
};
```


---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.