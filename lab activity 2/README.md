# Attendance Checker App

## Overview
This is a comprehensive attendance tracking system with user authentication and admin dashboard. Users can create accounts with a unique username (nickname) and full name, then record attendance with date and time.

## Features

### User Features
✅ **Sign Up**
- Username (nickname) - e.g., "personator"
- Full Name - e.g., "Christian Jorge A Hadap"
- Password
- No email required - focuses on identity verification

✅ **Sign In**
- Login with username and password
- Automatic attendance recording on sign-in (date and time)

✅ **User Dashboard**
- Display username, full name, and user ID
- View attendance log with all check-in times and dates
- Shows total check-ins
- Personalized welcome message

### Admin Features
✅ **Admin Access**
- Click "Admin Access" button (bottom-right)
- Enter admin password: **12345**

✅ **Admin Dashboard**
- View total users and total check-ins
- Search users by User ID, Username, or Full Name
- View all registered users with:
  - Username (nickname)
  - Full name
  - User ID
  - Total check-ins count
  - Account creation date
  - Last login time

✅ **User Details Modal**
- Click any user to view detailed information
- Shows:
  - Account Information (ID, Username, Full Name, Created Date, Last Login)
  - Credentials (Username - password hidden for security)
  - Attendance Log (all check-in times with dates)

## Technical Details

### Data Structure
Each user is stored with:
- `userId`: Unique identifier (USR_timestamp_random)
- `username`: Unique nickname/username for login
- `fullName`: User's full legal name
- `password`: User's login password
- `accountCreatedDate`: When account was created
- `lastLogin`: Last login timestamp
- `attendanceLog`: Array of all check-in records with timestamps

### Attendance Log Format
```javascript
{
  loginTime: "1/12/2026, 10:30:45 AM",
  timestamp: 1705066245000
}
```

### Admin Password
- Default: **12345**
- Can be changed by modifying the `ADMIN_PASSWORD` variable in `lab activity.js`

## File Structure
- `index.html` - Main HTML structure
- `style.css` - All styling and animations
- `lab activity.js` - All JavaScript logic and functionality

## Data Persistence
- All user data is stored in browser's localStorage
- Data persists even after browser closes
- To clear data: Open Developer Console → localStorage.clear()

## CSV Export & Digital Signature
The app exports attendance as CSV plus a companion signature JSON file. Signatures use ECDSA (P-256) via the Web Crypto API.
A signing key pair is generated and stored in localStorage (JWK) the first time an export is performed (demo-only).
CSV columns: `userId, username, fullName, loginTime, timestamp`.
Signature JSON includes:
  - `meta` (exporter, timestamps),
  - `signature` (base64 ECDSA signature over the CSV text),
  - `publicKey` (JWK) so the signature can be verified externally.

Use the "Export My Attendance" button on the user dashboard, or "Export All Attendance" on the Admin Dashboard.

## Key Distinctions
1. **Username**: Unique login identifier (nickname)
2. **User ID**: System-generated unique ID
3. **Full Name**: User's complete legal name
4. **Attendance Log**: All attendance records with precise date and time

## Usage Example
1. Click "Sign Up"
2. Enter Username: "personator"
3. Enter Full Name: "Christian Jorge A Hadap"
4. Enter Password: "mypassword"
5. Click "Sign Up"
6. Login with username and password
7. Each login is automatically recorded in your attendance log
8. Admin can view all users and their attendance through Admin Dashboard

## Security Notes
⚠️ This is a demo app. In production:
- Use proper password hashing (bcrypt, PBKDF2, etc.)
- Store data in a backend database
- Use HTTPS/SSL
- Implement proper session management
- Use authentication tokens (JWT)
- Hash and never display passwords
