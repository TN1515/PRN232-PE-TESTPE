# Post Manager - Full-Stack Application

A full-stack web application for managing posts with CRUD operations, built with React (frontend) and .NET 8 Web API (backend) with PostgreSQL database.

## 📋 Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Migration](#database-migration)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)

---

## 🚀 Technologies Used

### Backend
- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **PostgreSQL** - Relational database
- **Npgsql** - PostgreSQL provider for EF Core
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling

### DevOps
- **Docker** - Containerization
- **Render** - Backend hosting
- **Vercel/Netlify** - Frontend hosting

---

## 📁 Project Structure

```
/
├── backend/              # .NET 8 Web API
│   ├── Controllers/      # API controllers
│   ├── Models/          # Entity models
│   ├── DTOs/            # Data Transfer Objects
│   ├── Services/        # Business logic layer
│   ├── Data/            # DbContext and configurations
│   ├── Middleware/      # Custom middleware
│   ├── Migrations/      # EF Core migrations
│   ├── Dockerfile       # Docker configuration
│   └── Program.cs       # Application entry point
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── App.jsx      # Main app component
│   ├── package.json     # Dependencies
│   └── vite.config.js   # Vite configuration
│
└── README.md           # This file
```

---

## ✨ Features

### Post Management
- ✅ Create new posts with name, description, and optional image URL
- ✅ View all posts in a table format
- ✅ Edit existing posts
- ✅ Delete posts with confirmation dialog
- ✅ Search posts by name (real-time)
- ✅ Sort posts A→Z or Z→A
- ✅ Display images with placeholder for missing/broken images
- ✅ Form validation on client and server side
- ✅ Responsive design

### Technical Features
- ✅ RESTful API architecture
- ✅ Global exception handling
- ✅ CORS configuration
- ✅ Entity Framework migrations
- ✅ Docker support
- ✅ Environment-based configuration

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Docker** (optional, for containerization) - [Download](https://www.docker.com/products/docker-desktop)

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Configure Database Connection

Edit `appsettings.json` and update the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=postdb;Username=postgres;Password=yourpassword"
  }
}
```

**Replace:**
- `localhost` - Your PostgreSQL host
- `5432` - PostgreSQL port (default)
- `postdb` - Your database name
- `postgres` - Your PostgreSQL username
- `yourpassword` - Your PostgreSQL password

### 4. Build the Project

```bash
dotnet build
```

### 5. Run the Backend

```bash
dotnet run
```

The API will be available at:
- **HTTP:** `http://localhost:5000`
- **HTTPS:** `https://localhost:5001`
- **Swagger UI:** `http://localhost:5000/swagger`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API URL

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update with your deployed backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 4. Run the Frontend

```bash
npm run dev
```

The application will open at: `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

---

## 🗄️ Database Migration

### Create and Apply Migrations

If the migrations already exist in the project, skip to step 2.

#### 1. Create Initial Migration (if needed)

```bash
cd backend
dotnet ef migrations add InitialCreate
```

#### 2. Apply Migration to Database

```bash
dotnet ef database update
```

This will create the `Posts` table in your PostgreSQL database with the following schema:

**Posts Table:**
- `Id` (uuid, Primary Key)
- `Name` (varchar(200), Required)
- `Description` (varchar(1000), Required)
- `Image` (varchar(500), Optional)
- `CreatedAt` (timestamp)
- `UpdatedAt` (timestamp)

#### 3. Verify Migration

Check your PostgreSQL database to ensure the `Posts` table was created:

```bash
psql -U postgres -d postdb
\dt
\d Posts
```

---

## 🏃 Running the Application

### Running Both Backend and Frontend

**Terminal 1 (Backend):**
```bash
cd backend
dotnet run
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

---

## 🐳 Docker Setup

### Build Docker Image

Navigate to the backend folder:

```bash
cd backend
docker build -t post-api:latest .
```

### Run with Docker

#### Option 1: Run Container Only

```bash
docker run -d \
  -p 5000:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;Port=5432;Database=postdb;Username=postgres;Password=yourpassword" \
  --name post-api-container \
  post-api:latest
```

#### Option 2: Run with Docker Compose (Recommended)

Create `docker-compose.yml` in the backend folder:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: post-postgres
    environment:
      POSTGRES_DB: postdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    container_name: post-api
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=postdb;Username=postgres;Password=yourpassword"
    ports:
      - "5000:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Then run:

```bash
docker-compose up -d
```

### Run Migrations in Docker

```bash
docker exec -it post-api-container dotnet ef database update
```

Or with docker-compose:

```bash
docker-compose exec api dotnet ef database update
```

### View Logs

```bash
docker logs post-api-container
```

### Stop Containers

```bash
docker-compose down
```

---

## 🌐 Deployment

### Backend Deployment on Render

#### 1. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - Name: `post-database`
   - Database: `postdb`
   - User: `postuser`
   - Region: Choose closest to your users
4. Click **"Create Database"**
5. Copy the **Internal Database URL**

#### 2. Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `post-api`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `backend/Dockerfile`

#### 3. Add Environment Variables

In the **"Environment"** section, add:

```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<your-internal-database-url>
```

Replace `<your-internal-database-url>` with the connection string from step 1.

#### 4. Deploy

Click **"Create Web Service"**. Render will build and deploy your API.

Your API will be available at: `https://your-service-name.onrender.com`

#### 5. Run Migrations

After deployment, go to your web service and click **"Shell"**, then run:

```bash
dotnet ef database update
```

### Frontend Deployment on Vercel

#### 1. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

#### 2. Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### 3. Add Environment Variables

In **"Environment Variables"**, add:

```
VITE_API_URL=https://your-api-service.onrender.com/api
```

Replace with your Render backend URL.

#### 4. Deploy

Click **"Deploy"**. Your frontend will be available at:
`https://your-project.vercel.app`

### Alternative: Deploy Frontend on Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-api-service.onrender.com/api`
6. Click **"Deploy"**

---

## 📚 API Documentation

### Base URL

**Local:** `http://localhost:5000/api`  
**Production:** `https://your-service.onrender.com/api`

### Endpoints

#### 1. Get All Posts

```http
GET /api/posts
```

**Response (200 OK):**
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "My First Post",
    "description": "This is a description",
    "image": "https://example.com/image.jpg",
    "createdAt": "2024-11-13T10:30:00Z",
    "updatedAt": "2024-11-13T10:30:00Z"
  }
]
```

#### 2. Get Post by ID

```http
GET /api/posts/{id}
```

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "My First Post",
  "description": "This is a description",
  "image": "https://example.com/image.jpg",
  "createdAt": "2024-11-13T10:30:00Z",
  "updatedAt": "2024-11-13T10:30:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Post with ID {id} not found"
}
```

#### 3. Create Post

```http
POST /api/posts
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Post",
  "description": "Post description",
  "image": "https://example.com/image.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": "5gc07h86-7939-6784-d5he-4e185h88chc8",
  "name": "New Post",
  "description": "Post description",
  "image": "https://example.com/image.jpg",
  "createdAt": "2024-11-13T12:00:00Z",
  "updatedAt": "2024-11-13T12:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "errors": {
    "Name": ["Name is required"],
    "Description": ["Description is required"]
  }
}
```

#### 4. Update Post

```http
PUT /api/posts/{id}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Post",
  "description": "Updated description",
  "image": "https://example.com/updated.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Updated Post",
  "description": "Updated description",
  "image": "https://example.com/updated.jpg",
  "createdAt": "2024-11-13T10:30:00Z",
  "updatedAt": "2024-11-13T12:30:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Post with ID {id} not found"
}
```

#### 5. Delete Post

```http
DELETE /api/posts/{id}
```

**Response (204 No Content):**
```
(No body returned)
```

**Response (404 Not Found):**
```json
{
  "message": "Post with ID {id} not found"
}
```

### Validation Rules

| Field | Required | Max Length | Notes |
|-------|----------|------------|-------|
| Name | Yes | 200 chars | Cannot be empty |
| Description | Yes | 1000 chars | Cannot be empty |
| Image | No | 500 chars | Optional URL |

### Error Responses

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "An error occurred while processing your request.",
  "detailed": "Detailed error message"
}
```

---

## 🧪 Testing the API

### Using cURL

**Get all posts:**
```bash
curl http://localhost:5000/api/posts
```

**Create a post:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Post","description":"Test Description","image":"https://example.com/image.jpg"}'
```

**Update a post:**
```bash
curl -X PUT http://localhost:5000/api/posts/{id} \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","description":"Updated Description","image":""}'
```

**Delete a post:**
```bash
curl -X DELETE http://localhost:5000/api/posts/{id}
```

### Using Swagger UI

Navigate to `http://localhost:5000/swagger` to access interactive API documentation.

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** Cannot connect to PostgreSQL
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `appsettings.json`
- Ensure database exists: `psql -U postgres -l`

**Problem:** Migration fails
- Ensure PostgreSQL user has correct permissions
- Delete `Migrations` folder and recreate: `dotnet ef migrations add InitialCreate`

**Problem:** Port 5000 already in use
- Change port in `Properties/launchSettings.json`
- Or kill the process using port 5000

### Frontend Issues

**Problem:** API calls fail (CORS error)
- Ensure backend CORS is configured correctly
- Verify `VITE_API_URL` in `.env` is correct
- Check if backend is running

**Problem:** Build fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear cache: `npm cache clean --force`

### Docker Issues

**Problem:** Cannot connect to PostgreSQL from container
- Use `host.docker.internal` instead of `localhost`
- Ensure PostgreSQL accepts remote connections

**Problem:** Container exits immediately
- Check logs: `docker logs post-api-container`
- Verify environment variables are set correctly

---

## 📝 License

This project is open-source and available for educational purposes.

---

## 👤 Author

Built as a full-stack demonstration project.

---

## 🎯 Next Steps

- Add authentication (JWT)
- Implement pagination
- Add image upload functionality
- Add unit tests
- Add integration tests
- Implement caching (Redis)
- Add logging (Serilog)

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Check backend logs
4. Verify database connection

---

**Happy Coding! 🚀**
