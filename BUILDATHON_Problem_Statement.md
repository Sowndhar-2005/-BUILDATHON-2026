# BUILDATHON 2026 — Problem Statement

## Education Management Portal

**Category:** Web Development × Integrated AI

> **Implementation target:** Build a complete Education Management Portal with Student, Teacher, and Admin experiences, integrated with AI-powered academic intelligence.

---

# 1. Problem Statement Overview

Build an **Education Management Portal** that manages:

- Students
- Teachers
- Courses
- Classes
- Assignments
- Attendance
- Examinations
- Grades
- Academic records

The system must also provide **AI-powered academic intelligence** for performance analysis, weak-subject identification, academic-risk detection, personalized recommendations, and reports.

---

# 2. Pseudo Map / Expected Workflow

<!-- IMAGE PLACEHOLDER
     Put the official Pseudo Map image here.
     Expected file:
     ./problem_statement_images/pseudo-map.png
-->

![Official Pseudo Map — Education Management Portal](qai1jl11aibck8vesjnt.jpg)

**Image purpose:** This diagram represents the expected pages, user areas, academic workflow, AI engine, administration, and reporting flow.

---

# 3. Public Pages

## Home Page

The Home page should provide:

- Hero / Banner
- Announcements
- Featured Courses
- Top Teachers
- AI Study Tips
- CTA to Explore Courses

## Courses Page

The Courses page should provide:

- Course search
- Filtering
- Categories
- Course listing
- Top-rated courses

## Course Details

Course details should provide:

- Course information
- Syllabus
- Teacher information
- Schedule
- Enrollment / Access
- Enroll Now

## Contact Page

The Contact page should provide:

- Contact information
- Contact form
- FAQ
- Support

---

# 4. Student Experience

Students should be able to:

- Register and log in
- View profile
- View enrolled courses
- Submit assignments
- Check assignment due dates
- Check attendance
- View attendance summary
- View examination results
- View grades
- View grade history
- Track academic progress
- View performance overview
- Identify weak subjects
- View improvement tips
- Receive personalized AI recommendations
- View AI insights
- Access performance reports
- Download / print reports

### Student Dashboard

The dashboard should contain:

- Profile
- My Courses
- My Assignments
- Attendance
- Grades
- AI Recommendations
- Progress Overview

### My Progress

The progress section should contain:

- Performance Overview
- Weak Subjects
- Improvement Tips
- AI Insights

---

# 5. Teacher Experience

Teachers should be able to:

- Log in
- Manage courses
- Manage classes
- View students
- Mark attendance
- View attendance
- Create assignments
- View submissions
- Evaluate assignments
- Provide feedback
- Manage due dates
- Conduct examinations
- Enter marks
- Manage grades
- Monitor student performance
- View academic insights
- Access AI recommendations and reports

---

# 6. Academic Workflow

## Attendance

- Mark Attendance
- View Attendance
- Attendance Summary

## Assignments

- Create / View Assignments
- Submit Assignments
- Due Dates
- AI / Academic Feedback

## Exams & Grades

- Take / Manage Exams
- View Grades
- Grade History
- Exam Analysis
- Enter Examination Marks

---

# 7. AI-Powered Academic Intelligence

AI is a core part of this problem statement.

The AI engine should analyze:

- Attendance
- Assignment scores
- Examination marks
- Academic performance
- Performance trends

## Performance Analysis

Analyze academic performance and identify important trends.

## At-Risk Student Detection

Identify students who may be academically at risk using factors such as:

- Low attendance
- Low assignment scores
- Low examination scores
- Declining performance
- Weak subjects

## Weak Subject Identification

Identify subjects in which a student is performing poorly.

## Study Recommendations

Generate personalized recommendations for improving student performance.

## AI Insights

Provide useful AI insights and recommendations to:

- Students
- Teachers
- Administrators

---

# 8. Administration

Administrators should be able to:

- Manage students
- Manage teachers
- Manage courses
- Manage classes
- Manage assignments
- Manage examinations
- Manage grades
- Manage academic records
- View reports
- View analytics
- Monitor activities
- View AI insights

### Admin Dashboard

The Admin Dashboard should provide:

- Student management
- Teacher management
- Course and class management
- Assignment management
- Examination and grade management
- Reports and analytics
- AI insights and monitoring

---

# 9. Reports & Insights

The system should provide:

- Student performance
- Class performance
- Comparative reports
- Performance analytics
- Activity monitoring
- AI recommendations
- AI insights

Reports should cover:

- Academic progress
- Weak areas
- Risk analysis
- Recommendations
- Performance summaries

---

# 10. Performance Report & Summary

The final performance report should contain:

1. Academic Performance Summary
2. Weak Areas Identified
3. Risk Analysis
4. AI Recommendations
5. Download / Print Report

---

# 11. Core System Flow

```text
Student / Teacher / Admin
          |
          v
   Academic Activities
          |
          +--> Attendance
          +--> Assignments
          +--> Examinations
          +--> Grades
          |
          v
      Academic Data
          |
          v
       AI Engine
          |
     +----+----+----------------+
     |         |                |
     v         v                v
Performance   Risk        Weak Subject
Analysis      Detection   Identification
     |         |                |
     +---------+----------------+
               |
               v
     Personalized Recommendations
               |
               v
        AI Insights & Reports
               |
               v
     Performance Report/Summary
```

---

# 12. User Roles

| Role | Main Responsibilities |
|---|---|
| **Student** | Courses, assignments, attendance, exams, grades, progress, AI recommendations |
| **Teacher** | Courses, classes, attendance, assignments, exams, marks, student monitoring, AI insights |
| **Admin** | Students, teachers, courses, classes, assignments, exams, grades, analytics, reports, AI monitoring |

---

# 13. Key Product Objective

The portal should not function only as a basic education CRUD system.

The central idea is:

```text
Manage Academic Activities
          ↓
Collect Academic Data
          ↓
Analyze Performance
          ↓
Detect Weak Areas / Academic Risk
          ↓
Generate Personalized Recommendations
          ↓
Provide Useful Insights & Reports
```

---

# 14. Requirement Priority

## Must Implement

- Public pages
- Student experience
- Teacher experience
- Admin management
- Attendance
- Assignments
- Examinations and grades
- Academic records
- AI performance analysis
- Weak-subject identification
- At-risk student detection
- Personalized recommendations
- Reports and insights

## Expected Outcome

A working **Education Management Portal with Integrated AI** connecting:

**Students + Teachers + Administrators + Academic Data + AI Intelligence + Reports**

---

# 15. Official Evaluation Constraints

The organizers state that:

- A missing GitHub URL results in immediate disqualification with score 0.
- The repository is checked for the latest commit time.
- Late commits lead to disqualification.
- The evaluation system downloads the complete GitHub repository as a ZIP.
- The extracted raw code is analyzed together with the team's Problem Statement.
- AI evaluation covers:
  - Code Quality
  - Architecture
  - Security
  - Innovation
- The AI generates scores, merits, and demerits.
- Each AI evaluation has a 60-second timeout.

---

# 16. Important Implementation Principle

The repository should contain the **actual implementation of the Problem Statement and Pseudo Map**.

Avoid building only:

- Static UI mockups
- Non-functional buttons
- Placeholder AI responses
- Unconnected pages
- Features unrelated to the problem

The final system should demonstrate the complete academic workflow and meaningful AI-powered intelligence.

---

