# SheBuilds Builder's Arena API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication & User Endpoints

### Register User
**POST** `/auth/register` *(public)*

### Login User
**POST** `/auth/login` *(public)*

### Get Current User Profile
**GET** `/auth/me` *(protected)*

### Update User Profile
**PUT** `/auth/profile` *(protected)*

### Delete User Profile
**DELETE** `/auth/profile` *(protected)*

### Get User by Portfolio Slug
**GET** `/auth/user/:slug` *(public)*

### Admin: List All Users
**GET** `/auth/admin/users` *(admin)*

### Admin: Update User
**PUT** `/auth/admin/users/:id` *(admin)*

### Admin: Delete User
**DELETE** `/auth/admin/users/:id` *(admin)*

---

## Profile Endpoints

### Get Full Public Profile
**GET** `/profile/:username` *(public)*

### Setup or Update Profile
**POST** `/profile/setup` *(protected)*

---

## Announcement Endpoints

### List Announcements
**GET** `/announcement/` *(public)*

### Create Announcement
**POST** `/announcement/` *(admin)*

### Delete Announcement
**DELETE** `/announcement/:id` *(admin)*

---

## Challenge Endpoints

### List Challenges
**GET** `/challenges` *(public)*

### Get Challenge Details
**GET** `/challenges/:id` *(public)*

### Get User's Challenges
**GET** `/challenges/user/my-challenges` *(protected)*

### Register for Challenge
**POST** `/challenges/:challengeId/register` *(protected)*

### Submit Project to Challenge
**POST** `/challenges/:challengeId/submit` *(protected)*

### Admin: Create Challenge
**POST** `/challenges` *(admin)*

### Admin: Update Challenge
**PUT** `/challenges/:id` *(admin)*

### Admin: Set Challenge Winners
**PUT** `/challenges/:id/winners` *(admin)*

### Admin: Delete Challenge
**DELETE** `/challenges/:id` *(admin)*

---

## Grant Endpoints

### Apply for Grant
**POST** `/grants/apply` *(protected)*

**Note**: Only one grant application per project is allowed. If a project has already been submitted for a grant, subsequent attempts will be rejected.

### Get User's Grants
**GET** `/grants/my-grants` *(protected)*

### Get Grant by ID
**GET** `/grants/:id` *(protected)*

### Admin: List All Grants
**GET** `/grants/` *(admin)*

### Admin: Update Grant Status
**PUT** `/grants/:id/status` *(admin)*

### Admin: Delete Grant
**DELETE** `/grants/:id` *(admin)*

---

## Grant Application Endpoints

### Submit Grant Application
**POST** `/grant-applications` *(protected)*

**Note**: Only one application per project per grant program is allowed. If a project has already been submitted to a grant program, subsequent attempts will be rejected.

### Get User's Grant Applications
**GET** `/grant-applications/my-applications` *(protected)*

### Get Grant Application by ID
**GET** `/grant-applications/:id` *(protected)*

### Admin: List All Grant Applications
**GET** `/grant-applications` *(admin)*

### Admin: Update Grant Application Status
**PUT** `/grant-applications/:id/status` *(admin)*

---

## Project Endpoints

### List All Projects
**GET** `/projects` *(public)*

### Get Project by ID
**GET** `/projects/:id` *(public)*

### Get Projects by User
**GET** `/projects/user/:userId` *(public)*

### Create Project
**POST** `/projects` *(protected)*

### Update Project
**PUT** `/projects/:id` *(protected)*

### Delete Project
**DELETE** `/projects/:id` *(protected)*

---

## Progress Log Endpoints

### Get Recent Progress Logs
**GET** `/progress/recent` *(public)*

### Get Progress Logs for a Project
**GET** `/progress/project/:projectId` *(public)*

### Get Progress Log by ID
**GET** `/progress/:id` *(public)*

### Get User's Progress Logs
**GET** `/progress/user/my-logs` *(protected)*

### Create Progress Log
**POST** `/progress` *(protected)*

### Update Progress Log
**PUT** `/progress/:id` *(protected)*

### Delete Progress Log
**DELETE** `/progress/:id` *(protected)*

---

## Upload Endpoints

### Upload Profile Picture
**POST** `/upload/profile-picture` *(protected)*

### Upload Cover Image
**POST** `/upload/cover-image` *(protected)*

### Upload Project Media
**POST** `/upload/project-media` *(protected)*

### Upload Progress Media
**POST** `/upload/progress-media` *(protected)*

### Delete Uploaded File
**DELETE** `/upload/:publicId` *(protected)*

---

## Password Reset Endpoints

### Request Password Reset
**POST** `/password-reset/request` *(public)*

### Reset Password
**POST** `/password-reset/reset` *(public)*

### Verify Reset Token
**GET** `/password-reset/verify/:token` *(public)*

---

## Search & Analytics Endpoints

### Search Users
**GET** `/search/users` *(public)*

### Search Projects
**GET** `/search/projects` *(public)*

### Get Popular Skills
**GET** `/search/skills/popular` *(public)*

### Get Popular Tech Stack
**GET** `/search/tech-stack/popular` *(public)*

### Get Analytics
**GET** `/search/analytics` *(public)*

---

## Health Check

### API Health Check
**GET** `/health` *(public)*

---

## Notes
- *(protected)* endpoints require a valid JWT token in the Authorization header.
- *(admin)* endpoints require admin privileges.
- *(public)* endpoints are accessible without authentication.

---

## Error Responses

### Validation Error
```