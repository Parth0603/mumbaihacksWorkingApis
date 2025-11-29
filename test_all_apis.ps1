# FinZen API Complete Test Suite
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FinZen API - Complete Test Suite" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8001"
$testResults = @()

# Test 1: Root endpoint
Write-Host "[1] Testing Root Endpoint..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
    Write-Host "✅ Root endpoint working" -ForegroundColor Green
    $testResults += "✅ GET / - Success"
} catch {
    Write-Host "❌ Root endpoint failed: $_" -ForegroundColor Red
    $testResults += "❌ GET / - Failed"
}

# Test 2: Health Check
Write-Host "`n[2] Testing Health Check..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Health check: $($result.status) | DB: $($result.database)" -ForegroundColor Green
    $testResults += "✅ GET /health - Success"
} catch {
    Write-Host "❌ Health check failed" -ForegroundColor Red
    $testResults += "❌ GET /health - Failed"
}

# Test 3: Signup
Write-Host "`n[3] Testing Signup..." -ForegroundColor Yellow
$email = "test$(Get-Random)@example.com"
$phone = "98$(Get-Random -Minimum 10000000 -Maximum 99999999)"
try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method Post -ContentType "application/json" -Body (@{
        email = $email
        phone = $phone
        password = "test123456"
        name = "Test User"
        age = 25
        risk_profile = "moderate"
    } | ConvertTo-Json)
    
    $token = $signup.access_token
    $userId = $signup.user.id
    Write-Host "✅ Signup successful - User ID: $userId" -ForegroundColor Green
    $testResults += "✅ POST /api/auth/signup - Success"
} catch {
    Write-Host "❌ Signup failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/auth/signup - Failed"
    exit
}

# Test 4: Login
Write-Host "`n[4] Testing Login..." -ForegroundColor Yellow
try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        email = $email
        password = "test123456"
    } | ConvertTo-Json)
    
    Write-Host "✅ Login successful - Token received" -ForegroundColor Green
    $testResults += "✅ POST /api/auth/login - Success"
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/auth/login - Failed"
}

# Test 5: Get Profile
Write-Host "`n[5] Testing Get Profile..." -ForegroundColor Yellow
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Profile retrieved - Name: $($profile.name)" -ForegroundColor Green
    $testResults += "✅ GET /api/auth/profile - Success"
} catch {
    Write-Host "❌ Get profile failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/auth/profile - Failed"
}

# Test 6: Send OTP
Write-Host "`n[6] Testing Send OTP..." -ForegroundColor Yellow
try {
    $otp = Invoke-RestMethod -Uri "$baseUrl/api/auth/send-otp" -Method Post -ContentType "application/json" -Body (@{
        phone = $phone
    } | ConvertTo-Json)
    
    $otpCode = $otp.otp
    Write-Host "✅ OTP sent - Code: $otpCode" -ForegroundColor Green
    $testResults += "✅ POST /api/auth/send-otp - Success"
} catch {
    Write-Host "❌ Send OTP failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/auth/send-otp - Failed"
}

# Test 7: Verify OTP
Write-Host "`n[7] Testing Verify OTP..." -ForegroundColor Yellow
try {
    $verify = Invoke-RestMethod -Uri "$baseUrl/api/auth/verify-otp" -Method Post -ContentType "application/json" -Body (@{
        phone = $phone
        otp = $otpCode
    } | ConvertTo-Json)
    
    Write-Host "✅ OTP verified - KYC: $($verify.kyc_verified)" -ForegroundColor Green
    $testResults += "✅ POST /api/auth/verify-otp - Success"
} catch {
    Write-Host "❌ Verify OTP failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/auth/verify-otp - Failed"
}

# Test 8: Get Investments
Write-Host "`n[8] Testing Get Investments..." -ForegroundColor Yellow
try {
    $investments = Invoke-RestMethod -Uri "$baseUrl/api/investments/" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Investments retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/investments/ - Success"
} catch {
    Write-Host "❌ Get investments failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/investments/ - Failed"
}

# Test 9: Create Investment
Write-Host "`n[9] Testing Create Investment..." -ForegroundColor Yellow
try {
    $newInvestment = Invoke-RestMethod -Uri "$baseUrl/api/investments/" -Method Post -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body (@{
        amount = 1000
        investment_type = "mutual_fund"
        fund_name = "Test Fund"
    } | ConvertTo-Json)
    
    Write-Host "✅ Investment created" -ForegroundColor Green
    $testResults += "✅ POST /api/investments/ - Success"
} catch {
    Write-Host "❌ Create investment failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/investments/ - Failed"
}

# Test 10: Get Round-up Rules
Write-Host "`n[10] Testing Get Round-up Rules..." -ForegroundColor Yellow
try {
    $rules = Invoke-RestMethod -Uri "$baseUrl/api/investments/roundup-rules" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Round-up rules retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/investments/roundup-rules - Success"
} catch {
    Write-Host "❌ Get round-up rules failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/investments/roundup-rules - Failed"
}

# Test 11: Set Round-up Rules
Write-Host "`n[11] Testing Set Round-up Rules..." -ForegroundColor Yellow
try {
    $setRules = Invoke-RestMethod -Uri "$baseUrl/api/investments/roundup-rules" -Method Post -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body (@{
        enabled = $true
        multiplier = 2
    } | ConvertTo-Json)
    
    Write-Host "✅ Round-up rules set" -ForegroundColor Green
    $testResults += "✅ POST /api/investments/roundup-rules - Success"
} catch {
    Write-Host "❌ Set round-up rules failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/investments/roundup-rules - Failed"
}

# Test 12: Portfolio Summary
Write-Host "`n[12] Testing Portfolio Summary..." -ForegroundColor Yellow
try {
    $portfolio = Invoke-RestMethod -Uri "$baseUrl/api/portfolio/summary" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Portfolio summary retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/portfolio/summary - Success"
} catch {
    Write-Host "❌ Portfolio summary failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/portfolio/summary - Failed"
}

# Test 13: Portfolio Performance
Write-Host "`n[13] Testing Portfolio Performance..." -ForegroundColor Yellow
try {
    $performance = Invoke-RestMethod -Uri "$baseUrl/api/portfolio/performance?period=1m" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Portfolio performance retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/portfolio/performance - Success"
} catch {
    Write-Host "❌ Portfolio performance failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/portfolio/performance - Failed"
}

# Test 14: Education Modules
Write-Host "`n[14] Testing Education Modules..." -ForegroundColor Yellow
try {
    $modules = Invoke-RestMethod -Uri "$baseUrl/api/education/education/modules" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Education modules retrieved - Count: $($modules.modules.Count)" -ForegroundColor Green
    $testResults += "✅ GET /api/education/education/modules - Success"
} catch {
    Write-Host "❌ Education modules failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/education/education/modules - Failed"
}

# Test 15: Gamification Profile
Write-Host "`n[15] Testing Gamification Profile..." -ForegroundColor Yellow
try {
    $gamification = Invoke-RestMethod -Uri "$baseUrl/api/gamification/gamification/profile" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Gamification profile - Level: $($gamification.level), Points: $($gamification.points)" -ForegroundColor Green
    $testResults += "✅ GET /api/gamification/gamification/profile - Success"
} catch {
    Write-Host "❌ Gamification profile failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/gamification/gamification/profile - Failed"
}

# Test 16: Leaderboard
Write-Host "`n[16] Testing Leaderboard..." -ForegroundColor Yellow
try {
    $leaderboard = Invoke-RestMethod -Uri "$baseUrl/api/gamification/gamification/leaderboard?period=all&limit=10" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Leaderboard retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/gamification/gamification/leaderboard - Success"
} catch {
    Write-Host "❌ Leaderboard failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/gamification/gamification/leaderboard - Failed"
}

# Test 17: Claim Daily Reward
Write-Host "`n[17] Testing Claim Daily Reward..." -ForegroundColor Yellow
try {
    $reward = Invoke-RestMethod -Uri "$baseUrl/api/gamification/gamification/daily-reward" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Daily reward claimed - Reward: $($reward.reward)" -ForegroundColor Green
    $testResults += "✅ POST /api/gamification/gamification/daily-reward - Success"
} catch {
    Write-Host "❌ Claim daily reward failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/gamification/gamification/daily-reward - Failed"
}

# Test 18: AI Recommendations
Write-Host "`n[18] Testing AI Recommendations..." -ForegroundColor Yellow
try {
    $recommendations = Invoke-RestMethod -Uri "$baseUrl/api/ai/recommendations" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ AI recommendations retrieved" -ForegroundColor Green
    $testResults += "✅ GET /api/ai/recommendations - Success"
} catch {
    Write-Host "❌ AI recommendations failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/ai/recommendations - Failed"
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$testResults | ForEach-Object { Write-Host $_ }

$successCount = ($testResults | Where-Object { $_ -like "✅*" }).Count
$totalCount = $testResults.Count
Write-Host "`n$successCount/$totalCount tests passed" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "========================================`n" -ForegroundColor Cyan
