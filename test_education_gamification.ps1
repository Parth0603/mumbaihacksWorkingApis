# FinZen Education & Gamification Complete Test Suite
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FinZen Education & Gamification Tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8001"
$testResults = @()

# Create test user and get token
Write-Host "[SETUP] Creating test user..." -ForegroundColor Yellow
$email = "edutest$(Get-Random)@test.com"
$phone = "99$(Get-Random -Minimum 10000000 -Maximum 99999999)"
try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method Post -ContentType "application/json" -Body (@{
        email = $email
        phone = $phone
        password = "test123456"
        name = "Education Test User"
        age = 25
        risk_profile = "moderate"
    } | ConvertTo-Json)
    
    $token = $signup.access_token
    $userId = $signup.user.id
    Write-Host "✅ Test user created: $email" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create test user" -ForegroundColor Red
    exit 1
}

# EDUCATION MODULE TESTS
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "EDUCATION MODULE TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: GET /api/education/modules
Write-Host "`n[1] GET /api/education/modules" -ForegroundColor Yellow
try {
    $modules = Invoke-RestMethod -Uri "$baseUrl/api/education/modules" -Method Get
    Write-Host "✅ Modules retrieved: $($modules.total) modules" -ForegroundColor Green
    $testResults += "✅ GET /api/education/modules"
    $moduleId = $modules.modules[0]._id
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/education/modules"
}

# Test 2: GET /api/education/modules/{id}
Write-Host "`n[2] GET /api/education/modules/{id}" -ForegroundColor Yellow
try {
    $moduleDetail = Invoke-RestMethod -Uri "$baseUrl/api/education/modules/$moduleId" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Module detail: $($moduleDetail.title)" -ForegroundColor Green
    Write-Host "   Duration: $($moduleDetail.duration_minutes) min" -ForegroundColor Gray
    $testResults += "✅ GET /api/education/modules/{id}"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/education/modules/{id}"
}

# Test 3: POST /api/education/modules/{id}/start
Write-Host "`n[3] POST /api/education/modules/{id}/start" -ForegroundColor Yellow
try {
    $startModule = Invoke-RestMethod -Uri "$baseUrl/api/education/modules/$moduleId/start" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Module started: $($startModule.status)" -ForegroundColor Green
    $testResults += "✅ POST /api/education/modules/{id}/start"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/education/modules/{id}/start"
}

# Test 4: GET /api/education/modules/{id}/quiz
Write-Host "`n[4] GET /api/education/modules/{id}/quiz" -ForegroundColor Yellow
try {
    $quiz = Invoke-RestMethod -Uri "$baseUrl/api/education/modules/$moduleId/quiz" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Quiz retrieved: $($quiz.total_questions) questions" -ForegroundColor Green
    $testResults += "✅ GET /api/education/modules/{id}/quiz"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/education/modules/{id}/quiz"
}

# Test 5: POST /api/education/modules/{id}/quiz (Submit answers)
Write-Host "`n[5] POST /api/education/modules/{id}/quiz" -ForegroundColor Yellow
try {
    $quizAnswers = @{
        "0" = "To build wealth over time"
        "1" = "Higher risk, potentially higher reward"
    }
    $quizResult = Invoke-RestMethod -Uri "$baseUrl/api/education/modules/$moduleId/quiz" -Method Post -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body ($quizAnswers | ConvertTo-Json)
    Write-Host "✅ Quiz submitted: Score $($quizResult.score)% - $($quizResult.message)" -ForegroundColor Green
    Write-Host "   Correct: $($quizResult.correct)/$($quizResult.total)" -ForegroundColor Gray
    $testResults += "✅ POST /api/education/modules/{id}/quiz"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/education/modules/{id}/quiz"
}

# Test 6: GET /api/education/progress
Write-Host "`n[6] GET /api/education/progress" -ForegroundColor Yellow
try {
    $progress = Invoke-RestMethod -Uri "$baseUrl/api/education/progress" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Progress retrieved: $($progress.progress.Count) modules in progress" -ForegroundColor Green
    $testResults += "✅ GET /api/education/progress"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/education/progress"
}

# GAMIFICATION TESTS
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "GAMIFICATION TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 7: GET /api/gamification/profile
Write-Host "`n[7] GET /api/gamification/profile" -ForegroundColor Yellow
try {
    $gamProfile = Invoke-RestMethod -Uri "$baseUrl/api/gamification/profile" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Gamification profile retrieved" -ForegroundColor Green
    Write-Host "   Level: $($gamProfile.level) | Points: $($gamProfile.points)" -ForegroundColor Gray
    Write-Host "   Badges: $($gamProfile.badges.Count) | Streak: $($gamProfile.streak_days) days" -ForegroundColor Gray
    $testResults += "✅ GET /api/gamification/profile"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/gamification/profile"
}

# Test 8: POST /api/gamification/add-points
Write-Host "`n[8] POST /api/gamification/add-points" -ForegroundColor Yellow
try {
    $addPoints = Invoke-RestMethod -Uri "$baseUrl/api/gamification/add-points?points_type=investment_created" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Points added: $($addPoints.message)" -ForegroundColor Green
    Write-Host "   Total points: $($addPoints.total_points) | Level: $($addPoints.current_level)" -ForegroundColor Gray
    $testResults += "✅ POST /api/gamification/add-points"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/gamification/add-points"
}

# Test 9: GET /api/gamification/leaderboard
Write-Host "`n[9] GET /api/gamification/leaderboard" -ForegroundColor Yellow
try {
    $leaderboard = Invoke-RestMethod -Uri "$baseUrl/api/gamification/leaderboard?limit=10" -Method Get -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Leaderboard retrieved: $($leaderboard.total) users" -ForegroundColor Green
    if ($leaderboard.leaderboard.Count -gt 0) {
        Write-Host "   Top user: $($leaderboard.leaderboard[0].user_name) - $($leaderboard.leaderboard[0].points) points" -ForegroundColor Gray
    }
    $testResults += "✅ GET /api/gamification/leaderboard"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ GET /api/gamification/leaderboard"
}

# Test 10: POST /api/gamification/daily-reward
Write-Host "`n[10] POST /api/gamification/daily-reward" -ForegroundColor Yellow
try {
    $dailyReward = Invoke-RestMethod -Uri "$baseUrl/api/gamification/daily-reward" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Daily reward claimed: $($dailyReward.message)" -ForegroundColor Green
    Write-Host "   Streak: $($dailyReward.streak) days" -ForegroundColor Gray
    $testResults += "✅ POST /api/gamification/daily-reward"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/gamification/daily-reward"
}

# Test 11: POST /api/gamification/award-badge
Write-Host "`n[11] POST /api/gamification/award-badge" -ForegroundColor Yellow
try {
    $badge = Invoke-RestMethod -Uri "$baseUrl/api/gamification/award-badge?badge_name=Test%20Badge" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Badge awarded: $($badge.message)" -ForegroundColor Green
    $testResults += "✅ POST /api/gamification/award-badge"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/gamification/award-badge"
}

# Test 12: POST /api/gamification/streak
Write-Host "`n[12] POST /api/gamification/streak" -ForegroundColor Yellow
try {
    $streak = Invoke-RestMethod -Uri "$baseUrl/api/gamification/streak" -Method Post -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ Streak updated: $($streak.message)" -ForegroundColor Green
    $testResults += "✅ POST /api/gamification/streak"
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
    $testResults += "❌ POST /api/gamification/streak"
}

# SUMMARY
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$testResults | ForEach-Object { Write-Host $_ }

$successCount = ($testResults | Where-Object { $_ -like "✅*" }).Count
$totalCount = $testResults.Count
Write-Host "`n$successCount/$totalCount tests passed" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "========================================`n" -ForegroundColor Cyan
