# SheBuilds Backend Server

Backend API server for the SheBuilds Builder's Arena platform - a community platform for builders (especially women/non-binary builders) to showcase portfolios, add projects, apply for grants, and participate in challenges.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Project Management**: CRUD operations for builder projects
- **Grant System**: Apply for and manage grants
- **Challenge System**: Participate in hackathons and challenges
- **Progress Tracking**: Log and track project progress
- **Portfolio Builder**: Custom portfolio pages for builders

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **File Upload**: Multer + Cloudinary
- **Validation**: Custom middleware validation

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts     # Authentication logic
│   │   └── projectController.ts  # Project CRUD operations
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication
│   │   └── validation.ts        # Request validation
│   ├── models/
│   │   ├── User.ts              # User/Builder model
│   │   ├── Project.ts           # Project model
│   │   ├── Grant.ts             # Grant model
│   │   ├── Challenge.ts         # Challenge/Hackathon model
│   │   └── ProgressLog.ts       # Progress tracking model
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   └── projects.ts          # Project routes
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
├── package.json
├── tsconfig.json
└── env.example
```

## 🗄 Data Models

### User (Builder)
- Basic info: name, username, email, bio
- Portfolio: custom slug, profile picture
- Skills & interests: arrays of tags
- Social links: GitHub, LinkedIn, Twitter, personal site
- Verification status for trusted profiles

### Project
- Project details: title, description, tags, tech stack
- Status: idea, in-progress, completed
- Media: images, videos, demos
- Grant eligibility flag
- Team collaboration support

### Grant
- Amount and currency (INR/USD)
- Status: applied, in-review, approved, rejected
- Review notes and disbursement tracking
- Grant types: development, launch, scaling, research

### Challenge
- Event details: title, theme, duration
- Schedule: start/end dates
- Prizes and sponsors
- Rules and submission requirements
- Participant and winner tracking

### ProgressLog
- Project progress tracking
- Rich content with media support
- Impact summaries for grant evaluation
- Timeline-based organization

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shebuilds

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)
- `GET /api/auth/user/:slug` - Get user by portfolio slug

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `GET /api/projects/user/:userId` - Get user's projects

### Health Check
- `GET /health` - Server health status

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The database and collections will be created automatically

### Testing the API
You can test the API using tools like:
- Postman
- Insomnia
- curl commands

Example registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anita Builder",
    "username": "anita",
    "email": "anita@example.com",
    "password": "password123",
    "portfolio_slug": "anita-builder"
  }'
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevent abuse with request limiting
- **CORS Protection**: Configured for frontend integration
- **Helmet**: Security headers for Express
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Proper error responses

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure proper CORS origin
- Set up MongoDB connection string
- Configure Cloudinary for file uploads

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Add validation for new endpoints
5. Update documentation

## 📝 License

This project is part of the SheBuilds platform. 