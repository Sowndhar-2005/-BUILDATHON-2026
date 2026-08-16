@echo off
if exist "C:\Users\asown\AppData\Local\Programs\Python\Python313\python.exe" (
    "C:\Users\asown\AppData\Local\Programs\Python\Python313\python.exe" run.py
) else (
    py -3.13 run.py
)
pause
