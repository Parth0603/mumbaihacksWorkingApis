# FinZen - Smart Investment Platform

A modern fintech application that helps users invest spare change from daily transactions through automated round-up features, AI-powered recommendations, and financial education.

## 🚀 Features

- **Round-Up Investing**: Automatically invest spare change from daily purchases
- **AI Recommendations**: Personalized investment suggestions based on spending patterns
- **Portfolio Management**: Track and manage investment portfolios
- **Financial Education**: Interactive modules and quizzes to improve financial literacy
- **Gamification**: Badges, levels, and leaderboards to encourage good financial habits
- **Secure Authentication**: Multi-factor authentication with OTP verification
- **KYC Integration**: Complete Know Your Customer onboarding process

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **React Toastify** - Notifications

### Backend
- **Python/FastAPI** - High-performance API framework
- **MongoDB** - NoSQL database
- **JWT Authentication** - Secure token-based auth
- **Pydantic** - Data validation

## 📁 Project Structure

```
mumbaiHacks/
├── finzen-client/          # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Dashboard/  # Dashboard widgets
│   │   │   ├── Education/  # Learning modules
│   │   │   ├── Gamification/ # Badges & levels
│   │   │   ├── Investment/ # Portfolio components
│   │   │   └── Layout/     # Navigation & layout
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── store/          # State management
│   └── public/             # Static assets
├── finzen-server/          # Python backend
│   ├── app/
│   │   ├── controllers/    # API endpoints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   └── config/         # App configuration
│   └── tests/              # Test suites
└── schemas/                # Database schemas
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mumbaiHacks
   ```

2. **Setup Frontend**
   ```bash
   cd finzen-client
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm start
   ```

3. **Setup Backend**
   ```bash
   cd finzen-server
   pip install -r requirements.txt
   cp .env.example .env
   # Configure your environment variables
   python app/main.py
   ```

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

#### Backend (.env)
```
MONGODB_URL=mongodb://localhost:27017/finzen
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/kyc` - KYC submission

### Dashboard
- `GET /api/dashboard/stats` - User statistics
- `GET /api/dashboard/recommendations` - AI recommendations

### Investments
- `GET /api/investments/portfolio` - Portfolio summary
- `POST /api/investments/execute` - Execute investment
- `GET /api/investments/transactions` - Transaction history

### Education
- `GET /api/education/modules` - Learning modules
- `POST /api/education/quiz` - Submit quiz answers

### Gamification
- `GET /api/gamification/profile` - User level & badges
- `GET /api/gamification/leaderboard` - Global leaderboard

## 🎯 Key Features Implementation

### Round-Up Investment
- Automatically rounds up transactions to nearest rupee
- Invests spare change in diversified portfolios
- Configurable round-up rules and limits

### AI Recommendations
- Analyzes spending patterns and financial goals
- Suggests optimal investment strategies
- Personalized portfolio allocation recommendations

### Educational Gamification
- Interactive financial literacy modules
- Progress tracking and achievement badges
- Competitive leaderboards to encourage learning

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting on sensitive endpoints

## 📱 Responsive Design

- Mobile-first approach
- Progressive Web App (PWA) ready
- Cross-browser compatibility
- Accessible UI components

## 🧪 Testing

```bash
# Frontend tests
cd finzen-client
npm test

# Backend tests
cd finzen-server
python -m pytest tests/
```

## 📈 Performance

- Lazy loading for route components
- Optimized bundle size with code splitting
- Efficient state management with Zustand
- Database indexing for fast queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Mumbai Hackathon
- Inspired by modern fintech solutions
- Thanks to the open-source community

## 📞 Support

For support, email support@finzen.com or join our Slack channel.

---

**FinZen** - Making investing accessible, automated, and engaging for everyone! 🚀💰
