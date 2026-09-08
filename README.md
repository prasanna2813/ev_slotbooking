# ⚡ EVCharge – Smart EV Charging Slot Booking System

EVCharge is a web-based **EV Charging Slot Booking System** designed to help electric vehicle users find charging stations, check slot availability, get smart station recommendations, book charging slots, and join a queue when stations are full.

The system also provides an **Admin Dashboard** for managing charging stations, monitoring bookings, users, available slots, and queues.

---

## 🚀 Features

### 👤 User Features

- User Registration and Login
- JWT-based Authentication
- Secure Password Hashing using bcrypt
- User Profile Management
- Battery Percentage Tracking
- View Available EV Charging Stations
- View Nearby Charging Stations
- Battery-aware Charging Station Recommendation
- Charging Type Selection
- Charging Slot Booking
- Booking Time Conflict Prevention
- View My Bookings
- Cancel Booking
- Complete Booking
- Join Queue when station is full
- View Queue Position
- Estimated Waiting Time
- Cancel Queue
- Charging Slot Availability Notifications
- Booking Reminder Notifications
- Mark Notifications as Read
- Mark All Notifications as Read

---

## 👨‍💼 Admin Features

- Separate Admin Login
- Admin Authentication using JWT
- Role-based Access Control
- Admin Dashboard
- Total Users Statistics
- Total Stations Statistics
- Total Bookings Statistics
- Active Bookings
- Waiting Users
- Total Charging Slots
- Available Charging Slots
- View Recent User Bookings
- Add Charging Station
- Edit Charging Station
- Delete Charging Station
- Manage Station Availability
- Monitor Charging Network

---

## 🧠 Smart Recommendation System

EVCharge includes a rule-based recommendation system that considers multiple factors before recommending a charging station.

### Factors considered:

- 📍 Distance from the user
- ⚡ Available charging slots
- ⏳ Estimated waiting time
- 🔋 User battery percentage
- 🔌 Charging type
- 💰 Price per unit

The system gives additional priority to stations with better availability when the user's battery percentage is low.

### Recommendation Flow

```text
User Location
      ↓
Nearby Charging Stations
      ↓
Check Available Slots
      ↓
Check Waiting Users
      ↓
Check Distance
      ↓
Check Price
      ↓
Check Charging Type
      ↓
Consider Battery Percentage
      ↓
Calculate Recommendation Score
      ↓
Recommend Best Station
⏳ Queue Management

When a charging station has no available slots, users can join the waiting queue.

Station Full
     ↓
User Joins Queue
     ↓
Queue Position Assigned
     ↓
Estimated Waiting Time Calculated
     ↓
Slot Becomes Available
     ↓
Next User Notified
     ↓
User Can Book Charging Slot

The system automatically checks waiting queues and notifies the next waiting user when a slot becomes available.

🔔 Notification System

EVCharge provides notifications for important events such as:

Booking Confirmation
Booking Cancellation
Charging Completed
Queue Joined
Queue Slot Available
Booking Reminder

A background reminder job checks upcoming bookings and generates reminder notifications.

🛡️ Security

The application uses several security mechanisms:

JWT Authentication
Separate Admin Authentication
Role-based Authorization
Password Hashing using bcrypt
Protected API Routes
Admin-only Station Management
.env for sensitive configuration
.gitignore to prevent secret files from being pushed to GitHub
Booking conflict prevention
🏗️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Express.js
Database
MongoDB
MongoDB Atlas
Mongoose
Authentication & Security
JSON Web Token (JWT)
bcryptjs
Testing
Postman
Development Tools
VS Code
Git
GitHub
Deployment
Render
MongoDB Atlas
📂 Project Structure
EV-Slot-Booking/
│
├── backend/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── queueController.js
│   │   ├── stationController.js
│   │   └── notificationController.js
│   │
│   ├── jobs/
│   │   ├── reminderJob.js
│   │   └── automaticQueueJob.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Station.js
│   │   ├── Booking.js
│   │   ├── Queue.js
│   │   └── Notification.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── stationRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── queueRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── stations.html
│   ├── booking.html
│   ├── bookings.html
│   ├── notifications.html
│   ├── admin.html
│   ├── admin-login.html
│   ├── admin-stations.html
│   │
│   ├── style.css
│   ├── script.js
│   │
│   └── js/
│       ├── dashboard.js
│       ├── stations.js
│       ├── booking.js
│       ├── bookings.js
│       ├── notifications.js
│       ├── admin.js
│       ├── admin-login.js
│       └── admin-stations.js
│
└── README.md
⚙️ Installation and Setup
1. Clone the Repository
git clone YOUR_GITHUB_REPOSITORY_URL
2. Open the Project
cd ev_slotbooking
3. Install Backend Dependencies
cd backend
npm install
4. Configure Environment Variables

Create a .env file inside the backend folder.

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

Do not upload the .env file to GitHub.

▶️ Run the Backend
npm run dev

or

npm start

The backend will run on:

http://localhost:5000
🌐 Run the Frontend

Open the frontend folder and run the application using a local development server such as Live Server in VS Code.

Example:

http://127.0.0.1:5500/frontend/
🔐 API Modules
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
Admin
POST /api/admin/register
POST /api/admin/login
GET  /api/admin/dashboard
GET  /api/admin/bookings

GET    /api/admin/stations
POST   /api/admin/stations
PUT    /api/admin/stations/:id
DELETE /api/admin/stations/:id
Stations
GET /api/stations
GET /api/stations/nearby
GET /api/stations/recommend
GET /api/stations/:id
Bookings
POST /api/bookings
GET  /api/bookings/my-bookings
PUT  /api/bookings/complete/:id
PUT  /api/bookings/cancel/:id
Queue
POST /api/queue
GET  /api/queue/my-queue
POST /api/queue/notify-next
PUT  /api/queue/cancel/:id
Notifications
GET /api/notifications
PUT /api/notifications/read/:id
PUT /api/notifications/read-all
🧪 Testing

The backend APIs were tested using Postman.

Important test cases include:

User Registration
User Login
JWT Authentication
Admin Registration
Admin Login
Admin Authorization
Station Creation
Station Update
Station Deletion
Station Recommendation
Booking Creation
Duplicate Booking Prevention
Booking Cancellation
Booking Completion
Queue Joining
Queue Position Management
Automatic Queue Notification
Notification Retrieval
Booking Reminder
📊 System Workflow
                    EVCharge
                       │
          ┌────────────┴────────────┐
          │                         │
        USER                       ADMIN
          │                         │
      Register/Login            Admin Login
          │                         │
          ↓                         ↓
     User Dashboard          Admin Dashboard
          │                         │
    Find Stations             Manage Stations
          │                         │
          ↓                    Monitor Bookings
   Smart Recommendation       View Statistics
          │
     ┌────┴────┐
     │         │
 Available    Full
   Slot      Station
     │         │
     ↓         ↓
  Booking    Queue
     │         │
     ↓         ↓
Notification  Notification
     │         │
     └────┬────┘
          ↓
    Charging Process
🎯 Future Enhancements

The following features can be added in future versions:

Real-time charging station occupancy
IoT-based slot monitoring
Google Maps integration
Real-time GPS location
Online payment integration
QR-based charging session
Push notifications
Mobile application
Advanced analytics dashboard
Charging history
Revenue reports for station owners
Dynamic pricing
AI/ML-based demand prediction
💡 Problem Statement

As the number of electric vehicles increases, EV users may face difficulties in finding available charging stations and waiting for charging slots.

EVCharge addresses this problem by providing:

Charging station discovery
Slot availability
Smart recommendations
Advance booking
Queue management
Waiting time estimation
Notifications
Admin monitoring

This helps reduce unnecessary waiting time and improves the overall EV charging experience.

🏆 Project Highlights
Full-stack web application
REST API based backend
MongoDB database
JWT authentication
Role-based admin access
Smart station recommendation
Queue management
Automated notifications
Booking conflict prevention
Admin management dashboard
Responsive frontend
👨‍💻 Developer

Prasanna Reddy

Computer Science Engineering
SVCE, Tirupati

📌 Project Status

Status: Completed ✅

EVCharge currently supports the core user booking, queue, notification, station management, and admin dashboard functionality.

⭐ If you like this project

Give the repository a ⭐ and feel free to explore the project!