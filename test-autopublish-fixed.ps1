# Quick test script for auto-publishing
# Run this to manually trigger publishing of scheduled articles

Write-Host "?? Testing Auto-Publish Endpoint..." -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost:3000/api/ai/schedule-publish"

Write-Host "?? Calling: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "? SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "?? Results:" -ForegroundColor Cyan
        Write-Host "   Published: $($response.data.published) article(s)" -ForegroundColor White
        
        if ($response.data.published -gt 0) {
            Write-Host ""
            Write-Host "?? Articles were published!" -ForegroundColor Green
            
            if ($response.data.publishedArticles) {
                foreach ($article in $response.data.publishedArticles) {
                    Write-Host "   - $($article.title)" -ForegroundColor White
                }
            }
            
            if ($response.data.facebookPosts) {
                Write-Host ""
                Write-Host "?? Posted to Facebook:" -ForegroundColor Green
                foreach ($post in $response.data.facebookPosts) {
                    Write-Host "   - $($post.articleTitle)" -ForegroundColor White
                }
            }
        } else {
            Write-Host ""
            Write-Host "??  No articles ready to publish yet" -ForegroundColor Yellow
        }
        
        if ($response.data.scheduled -and $response.data.scheduled.Count -gt 0) {
            Write-Host ""
            Write-Host "?? Upcoming scheduled articles ($($response.data.scheduled.Count)):" -ForegroundColor Cyan
            foreach ($article in $response.data.scheduled) {
                $schedTime = [DateTime]::Parse($article.scheduledPublishAt)
                $timeUntil = $schedTime - (Get-Date)
                
                if ($timeUntil.TotalHours -lt 1) {
                    $timeStr = "$([int]$timeUntil.TotalMinutes) minutes"
                } elseif ($timeUntil.TotalDays -lt 1) {
                    $timeStr = "$([int]$timeUntil.TotalHours) hours"
                } else {
                    $timeStr = "$([int]$timeUntil.TotalDays) days"
                }
                
                Write-Host "   - $($article.title)" -ForegroundColor White
                Write-Host "     Scheduled: $($schedTime.ToString('yyyy-MM-dd HH:mm')) (in $timeStr)" -ForegroundColor Gray
            }
        }
        
    } else {
        Write-Host "? API returned an error:" -ForegroundColor Red
        Write-Host "   $($response.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "? Failed to connect to server!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "?? Make sure your dev server is running:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Then try again!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "????????????????????????????????????????" -ForegroundColor Gray
Write-Host ""
