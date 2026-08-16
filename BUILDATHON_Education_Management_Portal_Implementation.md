# BUILDATHON 2026 — Education Management Portal
## Problem Statement Implementation Specification

> **Purpose:** This document defines how the Education Management Portal Problem Statement will be implemented using the selected technology stack and the required user roles.

---

# 1. Problem Statement

Build an **Education Management Portal with Integrated AI** for managing students, teachers, courses, classes, assignments, attendance, examinations, academic records, performance analysis, and reports.

The implementation should connect:

```text
Students
   +
Teachers
   +
Academic Data
   ↓
AI Academic Intelligence
   ↓
Performance Analysis
   ↓
Recommendations & Reports
```

---

# 2. Technology Stack

## Frontend

- React
- JavaScript

The React application will provide:

- Public pages
- Authentication screens
- Student dashboard
- Teacher dashboard
- Admin dashboard
- Courses
- Assignments
- Attendance
- Exams
- Grades
- Progress
- AI insights
- Reports
- Management interfaces

## Backend

- FastAPI

FastAPI will provide:

- REST APIs
- Authentication and authorization
- Student management
- Teacher management
- Course management
- Class management
- Assignment management
- Attendance management
- Examination management
- Grade management
- Academic record management
- AI service integration
- Reports and analytics APIs

## Database

- PostgreSQL
- SQLAlchemy 2.0 Async
- Alembic

PostgreSQL stores the application's persistent academic and management data.

SQLAlchemy 2.0 Async is used for asynchronous database access.

Alembic is used for database schema migrations.

## UI / Visualization

- Meta / Atryx-inspired component approach
- Tailwind CSS
- Recharts
- Lucide Icons
- Sass

Use these consistently across the React application for:

- Layout
- Components
- Responsive styling
- Charts
- Icons
- Data visualization
- Application states

---

# 3. User Roles

The application has three primary roles:

```text
Admin
Teacher
Student
```

## 3.1 Admin

Admin manages the overall academic system.

Admin responsibilities:

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
- Monitor academic activity
- View AI insights

---

# 4. Teacher Roles

Teachers have two functional responsibilities in the academic system:

```text
Teacher
├── Class Management
└── Subject Management
```

## 4.1 Subject Teacher

The subject teacher manages subject-related academic work.

Responsibilities:

- Manage assigned subjects
- Manage subject syllabus
- Create subject assessments
- Conduct internal tests
- Conduct model examinations
- Create assignments
- Evaluate assignments
- Manage seminars where applicable
- Manage projects where applicable
- Upload class notes
- Enter subject marks
- Provide academic feedback
- Monitor subject performance

### Subject Assessment Structure

Internal marks are calculated out of **25 marks**.

The assessment components can vary by subject.

Possible components include:

```text
Internal Test
Model Examination
Assignment
Seminar
Project
```

A subject does not necessarily need to contain every component.

Therefore, the system must support **subject-specific assessment configuration**.

Example:

```text
Subject A
├── Internal Test
├── Model Examination
├── Assignment
├── Seminar
└── Project

Subject B
├── Internal Test
├── Model Examination
├── Assignment
└── Project
```

The configured components contribute to:

```text
Internal Assessment = /25
```

---

# 5. Class Teacher / Mentor Responsibilities

The class/mentor side manages class-level academic activities.

Responsibilities include:

- Manage assigned class
- View students in the class
- Manage class-related academic activities
- Manage attendance
- Monitor student progress
- Coordinate examinations
- Monitor overall student performance
- Monitor relevant student academic records

The class-level role focuses on:

```text
"What is happening with the class and its students?"
```

while the subject teacher focuses on:

```text
"What is happening in my subject?"
```

---

# 6. Student

Students should be able to:

- Register / log in
- View profile
- Access courses
- View subjects
- View class
- View assignments
- Submit assignments
- View class notes
- Check attendance
- View internal assessment marks
- View semester examination marks
- View final results
- Track academic progress
- View AI insights
- Receive personalized recommendations
- View performance reports

---

# 7. Academic Structure

The portal should support an academic structure such as:

```text
Academic Year
   ↓
Program / Batch
   ↓
Semester
   ↓
Subjects
   ↓
Academic Activities
```

A semester can contain multiple subjects.

Each subject can have its own assessment configuration.

---

# 8. Mark Calculation

The system uses:

```text
Internal Assessment = 25 marks
External Examination = 100 marks
Final Subject Mark = 100 marks
```

## Internal Mark

The internal assessment is calculated out of **25** using the assessment components configured for that particular subject.

Possible components:

- Internal Test
- Model Examination
- Assignment
- Seminar
- Project

The exact components can vary by subject.

## External Mark

The semester/external examination is conducted for:

```text
100 marks
```

The external mark is converted to:

```text
75 marks
```

Conversion:

```text
Converted External Mark = External Mark × 0.75
```

## Final Mark

```text
Final Mark
=
Internal Mark /25
+
Converted External Mark /75

Final Mark = /100
```

### Example

```text
Internal Mark = 21/25

External Examination = 84/100

Converted External:
84 × 0.75 = 63/75

Final:
21 + 63 = 84/100
```

---

# 9. Subject-Specific Assessment Configuration

The system must not hard-code the same assessment components for every subject.

Each subject should have an assessment configuration.

Example:

```text
Subject
   ↓
Assessment Configuration
   ├── Internal Test
   ├── Model Examination
   ├── Assignment
   ├── Seminar (optional)
   └── Project (optional)
```

The configuration determines which assessments exist for that subject and how they contribute to the internal mark.

---

# 10. Public Website

The public portal should provide:

## Home

- Hero / Banner
- Announcements
- Featured Courses
- Top Teachers
- AI Study Tips
- Explore Courses CTA

## Courses

- Search
- Filtering
- Categories
- Course listing
- Top-rated courses

## Course Details

- Course information
- Syllabus
- Teacher information
- Schedule
- Enrollment / Access

## Contact

- Contact information
- Contact form
- FAQ
- Support

---

# 11. Student Application

Student navigation should include:

```text
Dashboard
My Courses
Assignments
Attendance
Exams
Grades
Progress
AI Insights
Reports
Profile
```

## Student Dashboard

Display:

- Enrolled courses
- Attendance
- Average performance
- Upcoming assignments
- Upcoming examinations
- Subject performance
- Weak subjects
- Academic risk
- AI recommendations
- Recent activity

---

# 12. Teacher Application

Teacher navigation should include:

```text
Dashboard
Subjects / Courses
Classes
Students
Attendance
Assignments
Examinations
Marks
Class Notes
AI Insights
Reports
```

Subject teachers should see subject-focused operations.

Class/mentor teachers should see class-focused operations.

---

# 13. Admin Application

Admin navigation should include:

```text
Dashboard
Students
Teachers
Courses
Classes
Assignments
Examinations
Grades
Reports
Analytics
AI Insights
Activity Monitoring
```

Admin should have management interfaces for the major academic entities.

---

# 14. AI Academic Intelligence

AI is a core part of the problem statement.

The AI system should analyze academic data such as:

```text
Attendance
+
Internal Assessment
+
Assignments
+
Model Examination
+
Semester Examination
+
Final Marks
+
Academic Performance
```

The AI engine should provide:

## Performance Analysis

Analyze student and class academic performance.

## Weak Subject Identification

Identify subjects where the student is performing poorly.

## At-Risk Student Detection

Identify students who may be academically at risk.

Potential signals include:

- Low attendance
- Low internal performance
- Low assignment performance
- Poor examination performance
- Declining performance

## Performance Trends

Identify whether academic performance is:

- Improving
- Declining
- Stable

## Personalized Recommendations

Generate recommendations based on actual academic data.

Example:

```text
Student:
DBMS

Internal: 14/25
External: 52/100
Attendance: 68%

AI Insight:
DBMS performance indicates academic risk.

Recommendation:
Improve attendance and focus on the topics
covered in the upcoming examination.
```

AI recommendations should be connected to real academic records rather than functioning as a generic chatbot.

---

# 15. Reports & Insights

The system should provide:

- Student performance reports
- Class performance reports
- Subject performance
- Comparative reports
- Academic trends
- Weak areas
- Risk analysis
- AI recommendations

## Performance Report

Include:

```text
Academic Performance Summary
Weak Areas
Risk Analysis
Attendance
Internal Performance
External Performance
Final Marks
AI Recommendations
Performance Trends
```

Provide:

- Download report
- Print report

---

# 16. Core Data Flow

```text
                    USER
                     |
        +------------+------------+
        |            |            |
      Admin       Teacher      Student
                     |
             Academic Activities
                     |
        +------------+-------------+
        |            |             |
    Attendance   Assignments     Exams
        |            |             |
        +------------+-------------+
                     |
              Academic Records
                     |
              Internal /25
                     +
             External /75
                     |
               Final /100
                     |
                 AI ENGINE
                     |
       +-------------+-------------+
       |             |             |
 Performance    Weak Subject    Risk
  Analysis       Detection    Detection
       |             |             |
       +-------------+-------------+
                     |
          Recommendations
                     |
             Reports & Insights
```

---

# 17. Main Implementation Principle

The implementation should preserve the core Problem Statement:

```text
Manage Education
      ↓
Collect Academic Data
      ↓
Analyze Performance
      ↓
Identify Weak Areas
      ↓
Detect Academic Risk
      ↓
Generate Recommendations
      ↓
Provide Reports & Insights
```

The system should prioritize functional academic workflows and meaningful AI-powered intelligence over unrelated features.

---

# 18. Implementation Checklist

## Core

- [ ] React application
- [ ] Authentication
- [ ] Role-based access
- [ ] Admin
- [ ] Teacher
- [ ] Student
- [ ] Courses
- [ ] Classes
- [ ] Subjects
- [ ] Assignments
- [ ] Attendance
- [ ] Examinations
- [ ] Grades
- [ ] Academic records

## Subject Teacher

- [ ] Subject management
- [ ] Assessment configuration
- [ ] Internal tests
- [ ] Model examination
- [ ] Assignments
- [ ] Seminar where applicable
- [ ] Project where applicable
- [ ] Class notes
- [ ] Marks

## Class / Mentor

- [ ] Class management
- [ ] Student monitoring
- [ ] Attendance
- [ ] Class academic activities
- [ ] Examination coordination
- [ ] Student performance

## Marks

- [ ] Internal /25
- [ ] External /100
- [ ] External conversion to /75
- [ ] Final /100
- [ ] Subject-specific assessment configuration

## AI

- [ ] Performance analysis
- [ ] Weak subject detection
- [ ] At-risk detection
- [ ] Trend analysis
- [ ] Personalized recommendations
- [ ] AI insights

## Reports

- [ ] Student performance
- [ ] Class performance
- [ ] Comparative reports
- [ ] Risk analysis
- [ ] AI recommendations
- [ ] Download / print

---

# 19. Technology Summary

```text
Frontend
React + JavaScript

Backend
FastAPI

Database
PostgreSQL
SQLAlchemy 2.0 Async
Alembic

UI / Styling / Visualization
Tailwind
Sass
Recharts
Lucide Icons
Meta / Atryx-inspired UI approach
```

---

# 20. Final Product

The final application should provide a unified Education Management Portal where:

```text
Students
   ↓
Access courses and manage academic activities

Subject Teachers
   ↓
Manage subject-level academic work and marks

Class / Mentor Teachers
   ↓
Manage class-level activities, attendance, and student monitoring

Admins
   ↓
Manage the overall academic system

Academic Data
   ↓
AI Academic Intelligence
   ↓
Performance + Risk + Weak Subjects
   ↓
Recommendations
   ↓
Reports & Insights
```
