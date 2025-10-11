

***

# Project Documentation: Student-Faculty Opportunity Portal (MERN Stack)

## 1. Project Overview

A web portal for students and faculty that supports:
- Role-based login (using registration number and password).
- Password reset via OTP sent to college email.
- Faculty posts opportunity announcements; students view/apply based on eligibility.
- Faculty collects student responses; exports data for analysis.
- Automatic management of inactive opportunities.
- Responsive frontend using React.js + Tailwind CSS.
- Backend REST API with Node.js, Express, MongoDB.

***

## 2. Tech Stack

| Layer       | Technology            | Purpose                                    |
|-------------|-----------------------|--------------------------------------------|
| Frontend    | React.js + Tailwind CSS | UI development and styling                 |
| Backend     | Node.js + Express     | REST API, auth, business logic             |
| Database    | MongoDB               | Data storage (student, faculty, opportunities) |
| Authentication | JWT, bcrypt, nodemailer | Role-based login, password reset OTP via email |
| Scheduling  | Node-cron             | Automated tasks (e.g., marking inactive)  |
| File Export | exceljs, json2csv, pdfkit | Export responses in XLSX, CSV, PDF         |

***

## 3. System Architecture

- **Frontend:** React SPA communicating with backend APIs.
- **Backend:** RESTful endpoints for auth, user management, opportunities, responses.
- **Database:** MongoDB collections for Users, Opportunities, OTPs - linked via RegNo.
- **Email:** Nodemailer to send OTPs for password reset.
- **Security:** Passwords hashed using bcrypt; JWT tokens for session management.
- **Scheduler:** Cron jobs for maintenance tasks (inactive opportunities).

***

## 4. Functional Requirements

### 4.1 Login & Authentication

- Login via Reg No + Password.
- Role-based redirects (student or faculty home page).
- On first login or forgot password, reset password workflow:
  - Send OTP to registered college email.
  - Validate OTP.
  - Allow password change.
- Wrong credential prompts for retry.

### 4.2 Password Reset

- Input Reg No or email to request OTP.
- OTP verification page.
- If OTP correct, prompt new password and confirmation.
- Update MongoDB password field.
- Redirect to login after success.

### 4.3 Announcements - Faculty

- Faculty post opportunities (company, job title, description, eligibility, due date).
- Edit/delete existing opportunities.
- View and download student responses in XLSX, CSV, or PDF.

### 4.4 Announcements - Student

- View/filter recent opportunities based on eligibility.
- Apply/register for suitable opportunities.

### 4.5 Automation

- Background job to move inactive opportunities automatically.

***

## 5. Database Schema

### Users Collection

| Field               | Type      | Description                      |
|---------------------|-----------|----------------------------------|
| regNo               | String    | Registration number (unique)     |
| password            | String    | Hashed password                  |
| emailCollege        | String    | Registered college email         |
| emailPersonal       | String    | Personal email (optional)        |
| phoneNo             | String    | 10-digit phone number            |
| branchSection       | String    | Branch and section details       |
| graduationYear      | Number    | Year of graduation (4-digit)     |
| role                | String    | "student" or "faculty"            |
| otp                 | String    | Temporarily stored OTP            |
| otpExpiry           | Date      | OTP expiration timestamp         |

### Opportunities Collection

| Field               | Type         | Description                    |
|---------------------|--------------|--------------------------------|
| companyName         | String       | Company name                  |
| jobTitle            | String       | Position/job title            |
| applicationLink     | String       | URL for application           |
| jobDescription      | String       | Details of the opportunity    |
| eligibleGradYears   | [Number]     | Array of eligible graduation years |
| additionalInfo      | String       | Any extra notes               |
| dueDate             | Date         | Application deadline          |
| registeredStudents  | [String]     | List of Reg Nos applied       |
| notRegistered       | [String]     | List of Reg Nos not applied   |
| ignored             | [String]     | List of Reg Nos ignored       |
| status              | String       | "active" or "inactive"        |

***

## 6. API Endpoints (Example)

| Endpoint                | Method | Description                              | Access Role    |
|-------------------------|--------|-----------------------------------------|----------------|
| /api/auth/login         | POST   | Login with regNo and password            | All users      |
| /api/auth/request-otp   | POST   | Request OTP for password reset           | All users      |
| /api/auth/verify-otp    | POST   | Verify OTP for password reset            | All users      |
| /api/auth/reset-password | POST  | Reset password with new password         | All users      |
| /api/opportunities      | GET    | Get active opportunities with filters   | Students       |
| /api/opportunities      | POST   | Create opportunity                       | Faculty        |
| /api/opportunities/:id  | PUT    | Update opportunity                       | Faculty        |
| /api/opportunities/:id  | DELETE | Delete opportunity                       | Faculty        |
| /api/responses         | GET    | Get student responses                     | Faculty        |
| /api/users/profile     | GET    | Get logged-in user profile                | All users      |
| /api/users/profile     | PUT    | Update user profile                       | All users      |

***

## 7. Implementation Notes and Best Practices

- Use HTTPS for secure communication.
- Hash passwords with bcrypt.
- Use environment variables for secrets.
- Validate all inputs on server side.
- Set OTP expiry times and limit OTP requests rate.
- Role-based middleware to protect routes.
- Handle errors gracefully on both client and server.
- Write unit and integration tests for APIs.
- Document API endpoints using Swagger or Postman.
- Backup MongoDB regularly.

***

## 8. Development Workflow

- Setup Git repository with feature branching.
- Develop frontend and backend concurrently.
- Use Postman for API testing.
- Continuous integration with linting and testing.
- Deploy backend on platforms like Render, Vercel (for frontend).
- Use MongoDB Atlas for managed database.

***

## 9. Future Enhancements

- Email/SMS notification integration for announcements.
- Real-time notifications on opportunities/application status.
- Analytics dashboard with charts for faculty.
- Multi-factor authentication.
- Mobile app integration.

***