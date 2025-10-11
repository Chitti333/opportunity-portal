

***

# Login Module Documentation

## 1. Purpose

The Login Module handles user authentication and authorization in the system. It supports:
- Login via registration number and password.
- Role-based redirect to student or faculty home pages.
- OTP-based password reset workflow.
- Enforcement of reset password on first login if using default password.
- Secure error handling for invalid credentials.

***

## 2. Overview of Login Flow

1. User submits regNo and password on the login page.
2. Backend verifies credentials.
3. If incorrect, display an error message on the frontend.
4. If correct:
   - Check user role.
   - If first login with default password, prompt reset password popup.
   - Else redirect to role-specific home page.
5. Forgot password triggers OTP request flow to college email.
6. OTP verification and password reset handled separately with validation.

***

## 3. Functional Requirements

- **Validate login credentials** against stored hashed passwords.
- **Generate and manage JWT tokens** for session management.
- **Role-based routing** to student or faculty dashboard.
- **Force password reset** on first login if default password detected.
- **OTP generation, sending, and verification** for password reset.
- **Secure handling** of wrong credentials with retry prompts.
- Integration with MongoDB user schema for user details and OTP storage.

***

## 4. Modules and Their Responsibilities

### 4.1 User Model (Mongoose Schema)

- Defines user data structure in MongoDB.
- Fields include regNo, password (hashed), role, emails, phone, otp, otpExpiry, isFirstLogin.
- Methods: Password hashing, checking password validity.

### 4.2 Auth Controller

Handles the core login-related logic and OTP workflows.

- **login(req, res):**
  - Input: regNo, password.
  - Checks regNo existence and compares password after hashing.
  - If incorrect, responds with error.
  - If password is default and `isFirstLogin` flag is true, sends response to trigger password reset UI.
  - On success, generates JWT token with user role.
  - Responds with token and redirect info.

- **requestOtp(req, res):**
  - Input: regNo or email.
  - Verifies user exists.
  - Generates OTP, stores it with expiry.
  - Sends OTP via college email using nodemailer.
  - Responds with confirmation or error.

- **verifyOtp(req, res):**
  - Input: regNo/email and OTP.
  - Validates OTP against stored, checks expiry.
  - If valid, allows password reset.

- **resetPassword(req, res):**
  - Input: regNo/email, new password, confirm password.
  - Validates password criteria and confirmation.
  - Hashes new password, updates user record.
  - Resets OTP and `isFirstLogin` flag.

### 4.3 Auth Routes (Express Router)

- Routes `/login`, `/request-otp`, `/verify-otp`, `/reset-password`.
- Middleware for input validation, rate limiting OTP requests.
- Protect password reset endpoints only accessible after OTP verification.

### 4.4 Middleware

- **validateCredentials:** Checks presence and format of regNo/password.
- **roleCheck:** Verifies user role from JWT for authorized routes.
- **otpRateLimiter:** Limits OTP requests to prevent abuse.
- **jwtAuthentication:** Validates JWT tokens for protected APIs.

### 4.5 Utility Functions

- **generateOtp(length):** Creates random numeric OTP of given length.
- **sendOtpEmail(email, otp):** Sends OTP email using nodemailer configured with college SMTP.
- **hashPassword(password):** Hashes plain password using bcrypt.
- **comparePassword(plain, hash):** Compares login password with stored hash.
- **generateJwt(user):** Creates signed JWT including user ID and role.

***

## 5. Data Flow Diagram for Login

User → Login Page → POST /login → Auth Controller.login()
   → Validate creds → On success:
      - If first login with default password → Trigger reset password UI.
      - Else → Return JWT and role-based redirect.
   → On failure → Error message to frontend.

Forgot Password → Input regNo/email → POST /request-otp → Generate/send OTP
↑
Verify OTP → POST /verify-otp → On success → Allow password reset → POST /reset-password
↑
Reset Password → Update MongoDB user password and flags → Redirect to login page

***

## 6. Data Models Detail

### User Schema (partial)

```js
const UserSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty'], required: true },
  emailCollege: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  isFirstLogin: { type: Boolean, default: true }
  // Additional fields like phoneNo, branchSection, year etc.
});
```

***

## 7. Sample Function Definitions

### 7.1 login(req, res)

- Verify `regNo` in DB.
- Compare entered password with hashed.
- If fail, return 401 response.
- If first login with default password, return special response.
- Else, generate JWT with payload `{ userId, role }`.
- Send token and redirect URL based on role.

### 7.2 generateOtp(length)

- Generate numeric OTP string of given length.
- Securely random, reject insecure methods.

### 7.3 sendOtpEmail(email, otp)

- Compose email message with OTP and expiry details.
- Use nodemailer SMTP with college credentials.
- Send email to student/faculty.

### 7.4 resetPassword(req, res)

- Validate new password and confirmation match.
- Hash new password.
- Update user `password`, clear `otp`, set `isFirstLogin` to false.
- Return success message.

***

## 8. Security Considerations

- Passwords hashed with bcrypt (minimum 10 salt rounds).
- OTP expiry set (e.g., 10 minutes).
- Rate limit OTP requests per user/IP.
- Use HTTPS for all communication.
- Store JWTs securely on client (httpOnly cookies or secure storage).
- Validate all inputs to avoid injection attacks.

***

## 9. Error Handling

- Invalid credentials: return 401 Unauthorized with message.
- Expired or incorrect OTP: Return 400 Bad Request with retry instructions.
- Missing fields: 422 Unprocessable Entity.
- Server errors: 500 Internal Server Error with logs.

***

## 10. Testing

- Unit tests for each function:
  - Password hashing & verification.
  - OTP generation, expiry, validation.
  - JWT token creation and verification.
- Integration tests for login flow:
  - Happy path login.
  - First login password reset enforcement.
  - OTP request and verification workflow.
- Frontend tests for error messages and redirects.

***