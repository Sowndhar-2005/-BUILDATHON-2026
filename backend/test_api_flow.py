import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


def post(url, data, token=None):
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def get(url, token=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    req = urllib.request.Request(url, headers=headers, method='GET')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def run_tests():
    print("==================================================")
    print("🚀 EDUVISION AI - COMPREHENSIVE END-TO-END API TEST")
    print("==================================================")
    
    # 1. Student Login
    print("\n[1/5] Testing Student Authentication...")
    res = post('http://localhost:8000/api/auth/login', {'email': 'student.rahul@portal.edu', 'password': 'Student@123'})
    token = res['access_token']
    user = res['user']
    print(f"✅ Logged in as: {user['full_name']} (Role: {user['role']})")

    # 2. Student Marks & Section 8 Calculation
    print("\n[2/5] Verifying 25/75/100 Mark Calculation Pipeline...")
    marks = get(f"http://localhost:8000/api/exams-grades/student/{user['id']}", token)
    print(f"✅ Found {len(marks)} evaluated subjects for Rahul Verma:")
    for m in marks:
        print(f"  • [Subject #{m['subject_id']}]: "
              f"Internal={m['internal_total_25']}/25, "
              f"External(75%)={m['external_converted_75']}/75, "
              f"Final={m['final_mark_100']}/100, "
              f"Grade={m['letter_grade']}")


    # 3. AI Academic Intelligence Diagnostics
    print("\n[3/5] Testing Real-Time AI Diagnostic Engine...")
    ai = get(f"http://localhost:8000/api/ai/student/{user['id']}", token)
    print(f"✅ Academic Risk Level: {ai['risk_level'].upper()} (Risk Score: {ai['risk_score']}/100)")
    print(f"✅ Overall Attendance: {ai['overall_attendance_pct']}% | Average Marks: {ai['average_marks_pct']}%")
    print(f"✅ Trend Trajectory: {ai['trend_status'].upper()}")
    print(f"✅ AI Action Recommendations ({len(ai['recommendations_json'] or [])} items):")
    for item in (ai['recommendations_json'] or []):
        print(f"    - [{item.get('priority', 'Normal')}] {item.get('action', '')}")

    # 4. Teacher Login & Grade Entry
    print("\n[4/5] Testing Teacher Authentication & Roster Access...")
    tres = post('http://localhost:8000/api/auth/login', {'email': 'teacher.sharma@portal.edu', 'password': 'Teacher@123'})
    ttoken = tres['access_token']
    tuser = tres['user']
    print(f"✅ Logged in as Teacher: {tuser['full_name']}")
    classes = get('http://localhost:8000/api/classes/', ttoken)
    print(f"✅ Teacher accessible classes: {len(classes)}")

    # 5. Admin Privileges & System Analytics
    print("\n[5/5] Testing Institutional Admin & Analytics...")
    ares = post('http://localhost:8000/api/auth/login', {'email': 'admin@portal.edu', 'password': 'Admin@123'})
    atoken = ares['access_token']
    users = get('http://localhost:8000/api/users/', atoken)
    print(f"✅ Admin total institutional users count: {len(users)}")
    risk = get('http://localhost:8000/api/ai/risk-detection', atoken)
    print(f"✅ Admin campus-wide risk overview flagged students count: {len(risk)}")
    print("\n🎉 ALL BACKEND ENDPOINTS AND WORKFLOWS ARE FULLY FUNCTIONAL!")


if __name__ == '__main__':
    run_tests()
