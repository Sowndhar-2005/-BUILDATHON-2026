# Automated Launcher for FastAPI Backend
$PythonPath = "C:\Users\asown\AppData\Local\Programs\Python\Python313\python.exe"

if (Test-Path $PythonPath) {
    Write-Host "🚀 Launching FastAPI Backend with Python 3.13..." -ForegroundColor Cyan
    & $PythonPath run.py
} else {
    Write-Host "🚀 Launching FastAPI Backend with py launcher..." -ForegroundColor Cyan
    py -3.13 run.py
}
