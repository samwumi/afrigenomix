# Manual Auto-Publish Test Script
# Run this to manually trigger auto-publishing of scheduled articles

Write-Host "🚀 Running manual auto-publish..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$url = "http://localhost:3000/api/ai/schedule-publish"

Write-Host "📡 Checking for scheduled articles..." -ForegroundColor Yellow
Write-Host ""

try {
    # Note: You'll need to get an admin token first
    # For now, we'll just call the endpoint without auth for testing
    
    $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Results:" -ForegroundColor Cyan
        Write-Host "   Published: $($response.data.published) article(s)"
        Write-Host "   Scheduled: $($response.data.scheduled.Count) remaining"
        
        if ($response.data.published -gt 0) {
            Write-Host ""
            Write-Host "🎉 Articles were published!" -ForegroundColor Green
            
            if ($response.data.facebookPosts) {
                Write-Host "📱 Posted to Facebook: $($response.data.facebookPosts.Count) post(s)" -ForegroundColor Green
                foreach ($post in $response.data.facebookPosts) {
                    Write-Host "   - $($post.articleTitle)"
                    Write-Host "     $($post.postUrl)"
                }
            }
        } else {
            Write-Host ""
            Write-Host "ℹ️  No articles ready to publish yet" -ForegroundColor Yellow
        }
        
        if ($response.data.scheduled.Count -gt 0) {
            Write-Host ""
            Write-Host "📅 Upcoming scheduled articles:" -ForegroundColor Cyan
            foreach ($article in $response.data.scheduled) {
                $schedTime = [DateTime]::Parse($article.scheduledPublishAt)
                Write-Host "   - $($article.title)"
                Write-Host "     Scheduled for: $($schedTime.ToString('yyyy-MM-dd HH:mm'))"
            }
        }
        
    } else {
        Write-Host "❌ ERROR: $($response.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Failed to connect to server" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure your dev server is running:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Yellow
}

Write-Host ""
