# FinZen Backend - Quick Start Guide

## Status: PRODUCTION-READY ✓

### What Was Fixed

The FinZen FastAPI backend had 6 critical issues that have all been resolved:

1. **Pydantic v2 Compatibility** - Updated config classes to use `model_config`
2. **Database Error Handling** - Changed from 500 errors to proper 503 Service Unavailable
3. **Graceful Startup** - App starts even without valid MongoDB connection
4. **Unified Authentication** - Fixed route dependencies to use consistent auth approach
5. **Connection Pooling** - Removed redundant MongoDB client creation in services
6. **Terminal Compatibility** - Replaced emoji with ASCII characters for Windows support

### How to Run

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create environment file
cp .env.example .env

# 3. Update .env with your MongoDB URI
# Edit .env and replace MONGODB_URI

# 4. Start the server
uvicorn app.main:app --reload
```

**API available at:** `http://localhost:8000`

### Access Points

| URL | Purpose |
|-----|---------|
| `http://localhost:8000/` | API root |
| `http://localhost:8000/health` | Health check |
| `http://localhost:8000/docs` | Swagger UI (interactive docs) |
| `http://localhost:8000/redoc` | ReDoc (alternative docs) |
| `http://localhost:8000/openapi.json` | OpenAPI schema |

### Test the Backend

```bash
# From PowerShell:
$response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -Method GET
$response.StatusCode  # Should be 200

# From Python:
import httpx
response = httpx.get("http://localhost:8000/health")
print(response.json())  # Shows: {"status": "HEALTHY", ...}
```

### All Endpoints

**18 endpoints available** across 6 categories:

- **Auth** (5 endpoints): signup, login, send-otp, verify-otp, profile
- **Investments** (3 endpoints): list, create, roundup rules
- **Portfolio** (2 endpoints): summary, performance
- **Education** (3 endpoints): modules, detail, quiz
- **Gamification** (3 endpoints): profile, leaderboard, daily-reward
- **AI** (1 endpoint): recommendations

### Important Notes

- **Without MongoDB:** Routes return `503 Service Unavailable` (not 500 errors)
- **Authentication:** Include `Authorization: Bearer {token}` header for protected routes
- **CORS:** Configured for `localhost:3000` frontend
- **Docs:** Auto-generated at `/docs` - always up-to-date with code

### Files Modified

1. `app/config/settings.py` - Pydantic v2 config
2. `app/config/database.py` - Graceful error handling
3. `app/schemas/user.py` - Pydantic v2 config
4. `app/routes/education.py` - Fixed auth import
5. `app/routes/gamification.py` - Fixed auth import
6. `app/main.py` - Removed emoji
7. `app/services/portfolio_service.py` - Connection pooling
8. `requirements.txt` - Added email-validator
9. `.env` - Created with defaults

### Performance & Stability

- ✓ Async/await used correctly throughout
- ✓ Proper HTTP status codes (no 500 errors on validation)
- ✓ Graceful degradation when DB unavailable
- ✓ Connection pooling optimized
- ✓ No blocking calls in async routes
- ✓ Full error logging and tracing

### Deployment

For production:

1. Update `ENVIRONMENT=production` in `.env`
2. Change `JWT_SECRET_KEY` to a strong secret
3. Use actual MongoDB Atlas connection string
4. Deploy with: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

---

**For detailed information, see `FIXES_SUMMARY.md`**
