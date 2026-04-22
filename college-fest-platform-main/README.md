# 🚀 TechFest 2026 - College Fest Management Platform

A futuristic, full-stack college fest management platform built with React.js, Node.js, and MongoDB. Features stunning glassmorphism UI, Three.js animations, and comprehensive event management capabilities.

## ✨ Features

### 🎨 Frontend Features
- **Futuristic Design**: Glassmorphism UI with neon accents and smooth animations
- **3D Animations**: Interactive Three.js particle backgrounds and 3D elements
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Transitions**: Framer Motion animations throughout the application
- **Interactive Components**: Hover effects, micro-interactions, and loading states

### 🔐 Authentication System
- **User Registration/Login**: JWT-based authentication with secure password hashing
- **Role-based Access**: User and Admin roles with different permissions
- **Protected Routes**: Authentication guards for sensitive pages
- **Profile Management**: Update user information and change passwords

### 📅 Event Management
- **Dynamic Event Categories**: Sports, Games, and Athletics events
- **Event Registration**: Users can register for events after payment
- **Real-time Availability**: Live participant count and availability tracking
- **Event Details**: Comprehensive event information with rules and requirements
- **Search & Filter**: Advanced search and category filtering

### 💳 Payment System
- **Fest Fee Payment**: Secure payment gateway simulation
- **Multiple Payment Methods**: UPI, Credit/Debit Cards, Net Banking, Wallets
- **Payment Status Tracking**: Real-time payment status updates
- **Transaction History**: Complete payment history for users

### 📊 Analytics Dashboard
- **Admin Analytics**: Comprehensive analytics with charts and statistics
- **User Management**: View and manage all registered users
- **Event Analytics**: Track event popularity and registrations
- **Revenue Tracking**: Monitor payment collections and revenue
- **Data Export**: Export user and registration data as CSV

### 🎫 QR Code System
- **Digital Passes**: QR code generation for paid users
- **Event Tickets**: Individual QR codes for event registrations
- **Downloadable Passes**: Download and print digital passes

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling and design system
- **Framer Motion** - Animations and transitions
- **Three.js** - 3D graphics and animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React QR Code** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation

### Development Tools
- **Concurrently** - Run multiple scripts
- **Nodemon** - Auto-restart development server
- **ESLint** - Code linting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/college-fest-platform.git
cd college-fest-platform
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install all dependencies at once
npm run install-all

# Or install separately
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college-fest
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Replace `your-super-secret-jwt-key-change-this-in-production` with a secure JWT secret.

#### Frontend Environment

The frontend is configured to work with the backend running on `localhost:5000`. No additional environment setup is required.

### 4. Database Setup

#### Option 1: Local MongoDB

If you have MongoDB installed locally, the default connection string will work:

```env
MONGODB_URI=mongodb://localhost:27017/college-fest
```

#### Option 2: MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-fest
```

### 5. Start the Application

Start both frontend and backend concurrently:

```bash
npm run dev
```

Or start them separately:

```bash
# Start backend (in one terminal)
npm run server

# Start frontend (in another terminal)
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
college-fest-platform/
├── backend/
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Registration.js
│   │   └── Payment.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── payments.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── ParticleBackground.js
│   │   │   └── LoadingSpinner.js
│   │   ├── context/            # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.js
│   │   │   ├── EventsPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── PaymentPage.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── EventDetailPage.js
│   │   │   ├── ContactPage.js
│   │   │   └── GalleryPage.js
│   │   ├── App.js              # Main App component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   └── tailwind.config.js      # Tailwind configuration
├── package.json                # Root package.json
└── README.md
```

## 🔧 Development Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🎯 Default Admin Account

To access the admin dashboard, you can create an admin user manually in the database or use the following method:

1. Register a normal user account
2. Update the user's role to 'admin' in MongoDB:

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🎨 Customization

### Theming and Colors

The application uses a futuristic dark theme with neon accents. You can customize the colors in:

- **Tailwind Config**: `frontend/tailwind.config.js`
- **CSS Variables**: `frontend/src/index.css`

### Adding New Events

To add new event categories or subcategories:

1. Update the `Event.js` model in `backend/models/`
2. Update the validation schema
3. Add the new options to the frontend forms

### Payment Integration

The current implementation uses a simulated payment gateway. To integrate with real payment providers:

1. Update the payment routes in `backend/routes/payments.js`
2. Add your payment provider's SDK
3. Update the frontend payment form components

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your hosting provider

3. Set environment variables:
```
REACT_APP_API_URL=https://your-backend-url.com/api
# Optional: keep admin page limited to payment approvals only
# REACT_APP_PAYMENT_APPROVAL_ONLY=true
# Optional: router mode override.
# Unset = hash router in production, browser router in development.
# REACT_APP_USE_HASH_ROUTER=true
```

### Backend Deployment (Heroku/Railway)

1. Set environment variables in your hosting provider
2. Update the MongoDB URI to use your production database
3. (Optional) Set `AUTO_SEED_EVENTS=true` so backend inserts default events only when active events are empty
4. Deploy the backend application
5. If you want manual setup from your own machine (without paid shell), run:
```bash
cd backend
npm run create-admin
npm run seed:events
```

### Database Deployment

- **MongoDB Atlas**: Recommended for production
- **Self-hosted MongoDB**: For full control over your database

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updateprofile` - Update profile
- `PUT /api/auth/changepassword` - Change password

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/my-registrations` - Get user registrations
- `DELETE /api/events/:id/cancel` - Cancel registration

### Payments
- `POST /api/payments/fest-fee` - Process fest fee payment
- `GET /api/payments/:transactionId/status` - Get payment status
- `GET /api/payments/history` - Get payment history

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/users` - Get all users
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `GET /api/admin/export/registrations` - Export data

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**
   - The backend is configured to allow `localhost:3000`
   - Update the CORS origins if using a different port

3. **JWT Token Issues**
   - Check that JWT_SECRET is set in `.env`
   - Ensure the token is being sent in the Authorization header

4. **Payment Processing**
   - The payment system is simulated
   - Check browser console for any errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Three.js for 3D graphics capabilities
- Framer Motion for smooth animations
- MongoDB for the flexible database solution

## 📞 Support

For support and questions:

- 📧 Email: support@techfest2026.com
- 🌐 Website: https://techfest2026.com
- 📱 Phone: +91 80195 48729

---

**Built with ❤️ by the College Fest Team**
