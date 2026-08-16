import asyncio
from datetime import datetime, date, timedelta
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, AcademicYear, Course, ClassEntity, Subject,
    SubjectAssessmentConfig, Assignment, AssignmentSubmission,
    Exam, StudentMark, AttendanceRecord, DailyStudyTip
)
from app.services.calculation_service import calculation_service
from app.services.ai_service import ai_service

async def seed_database():
    print("⚡ Initializing database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        check_user = await db.execute(select(User).limit(1))
        if check_user.scalar_one_or_none():
            print("Database already contains data. Skipping initial seed.")
            return

        print("🌱 Seeding realistic academic portal data...")

        # 1. Users (Admin, Teachers, Students)
        admin = User(
            email="admin@portal.edu",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Dr. Rajeshwari Swaminathan",
            role=UserRole.ADMIN,
            department="Dean of Academic Affairs",
            phone="+91 98765 43210",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            bio="Dean of Academic Affairs with 20+ years of institutional governance and curriculum design experience.",
            is_active=True
        )

        teacher1 = User(
            email="teacher.sharma@portal.edu",
            hashed_password=get_password_hash("Teacher@123"),
            full_name="Prof. Vikram Sharma",
            role=UserRole.TEACHER,
            department="Computer Science & Engineering",
            specialization="Database Systems & Big Data Architectures",
            phone="+91 98765 11111",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            bio="Associate Professor specializing in Distributed Systems, SQL Optimization, and Relational Modeling.",
            is_active=True
        )

        mentor1 = User(
            email="mentor.kumar@portal.edu",
            hashed_password=get_password_hash("Teacher@123"),
            full_name="Dr. Ananya Kumar",
            role=UserRole.TEACHER,
            department="Computer Science & Engineering",
            specialization="Algorithms & Machine Learning / Class Mentor",
            phone="+91 98765 22222",
            avatar_url="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80",
            bio="Senior Faculty & Class Mentor for B.Tech CSE Class of 2026. Guides student career roadmaps and academic welfare.",
            is_active=True
        )

        teacher3 = User(
            email="teacher.iyer@portal.edu",
            hashed_password=get_password_hash("Teacher@123"),
            full_name="Prof. Karthik Iyer",
            role=UserRole.TEACHER,
            department="Information Technology",
            specialization="Cloud Computing & Network Security",
            phone="+91 98765 33333",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            bio="Expert in Cloud Infrastructure, DevOps pipelines, and Distributed Consensus Protocols.",
            is_active=True
        )

        db.add_all([admin, teacher1, mentor1, teacher3])
        await db.flush()

        # 2. Classes
        class_cse_a = ClassEntity(
            name="B.Tech CSE - Section A (Semester 6)",
            batch_year="2022-2026",
            semester=6,
            department="Computer Science & Engineering",
            mentor_teacher_id=mentor1.id
        )
        class_cse_b = ClassEntity(
            name="B.Tech CSE - Section B (Semester 6)",
            batch_year="2022-2026",
            semester=6,
            department="Computer Science & Engineering",
            mentor_teacher_id=teacher1.id
        )
        db.add_all([class_cse_a, class_cse_b])
        await db.flush()

        # 3. Students
        student_rahul = User(
            email="student.rahul@portal.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Rahul Verma",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            enrollment_number="22CS014",
            class_id=class_cse_a.id,
            avatar_url="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
            bio="B.Tech 3rd year student interested in Web Development and Open Source.",
            phone="+91 91234 56780",
            is_active=True
        )

        student_priya = User(
            email="student.priya@portal.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Priya Sundaram",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            enrollment_number="22CS042",
            class_id=class_cse_a.id,
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            bio="B.Tech candidate exploring Neural Network architectures and Competitive Programming.",
            phone="+91 91234 56781",
            is_active=True
        )

        student_arjun = User(
            email="student.arjun@portal.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Arjun Patel",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            enrollment_number="22CS089",
            class_id=class_cse_a.id,
            avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            bio="Aspiring Cloud Solutions Architect with interest in Kubernetes and Docker microservices.",
            phone="+91 91234 56782",
            is_active=True
        )

        student_sneha = User(
            email="student.sneha@portal.edu",
            hashed_password=get_password_hash("Student@123"),
            full_name="Sneha Mukherjee",
            role=UserRole.STUDENT,
            department="Computer Science & Engineering",
            enrollment_number="22CS105",
            class_id=class_cse_a.id,
            avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
            bio="Passionate about UI/UX design systems and Human-Computer Interaction.",
            phone="+91 91234 56783",
            is_active=True
        )

        db.add_all([student_rahul, student_priya, student_arjun, student_sneha])
        await db.flush()

        # 4. Featured Courses for Public Catalog
        course1 = Course(
            code="CS-601",
            title="Database Management Systems & Advanced SQL",
            category="Database & Storage",
            description="Deep dive into relational algebra, query optimization, indexing trees, ACID transactions, and distributed schemas.",
            thumbnail="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
            credits=4,
            rating=4.9,
            total_reviews=156,
            is_featured=True,
            lead_teacher_id=teacher1.id,
            syllabus_json=[
                {"module": 1, "title": "Relational Data Models & Schema Design", "hours": 8},
                {"module": 2, "title": "SQL Deep Dive, Joins, Subqueries & Views", "hours": 10},
                {"module": 3, "title": "Normalization (1NF to 5NF, BCNF) & Anomalies", "hours": 8},
                {"module": 4, "title": "Indexing (B+ Trees, Hash Indexes) & Query Tuning", "hours": 8},
                {"module": 5, "title": "Transaction Management, Concurrency & Locking", "hours": 10}
            ],
            schedule_info="Mon & Wed: 09:30 AM - 11:00 AM"
        )

        course2 = Course(
            code="CS-602",
            title="Design and Analysis of Algorithms",
            category="Algorithms",
            description="Master algorithmic paradigms: Divide & Conquer, Dynamic Programming, Greedy approaches, and Graph Traversal.",
            thumbnail="https://images.unsplash.com/photo-1516116211227-bbc13c7d6352?w=600&auto=format&fit=crop&q=80",
            credits=4,
            rating=4.8,
            total_reviews=142,
            is_featured=True,
            lead_teacher_id=mentor1.id,
            syllabus_json=[
                {"module": 1, "title": "Asymptotic Analysis & Recurrence Relations", "hours": 8},
                {"module": 2, "title": "Divide & Conquer Algorithms", "hours": 10},
                {"module": 3, "title": "Dynamic Programming & Memoization", "hours": 12},
                {"module": 4, "title": "Graph Algorithms: Shortest Paths & MST", "hours": 10}
            ],
            schedule_info="Tue & Thu: 11:15 AM - 12:45 PM"
        )

        course3 = Course(
            code="CS-603",
            title="Cloud Computing & Distributed DevOps",
            category="Cloud & Infrastructure",
            description="Explore modern cloud architecture, container orchestration with Kubernetes, Terraform IaC, and CI/CD pipelines.",
            thumbnail="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            credits=4,
            rating=4.9,
            total_reviews=188,
            is_featured=True,
            lead_teacher_id=teacher3.id,
            syllabus_json=[
                {"module": 1, "title": "Cloud Service Models (IaaS, PaaS, SaaS)", "hours": 6},
                {"module": 2, "title": "Containerization with Docker & Multi-stage Builds", "hours": 10},
                {"module": 3, "title": "Kubernetes Pods, Services, and Deployments", "hours": 12},
                {"module": 4, "title": "CI/CD Automations & Infrastructure as Code", "hours": 10}
            ],
            schedule_info="Fri: 02:00 PM - 05:00 PM"
        )

        course4 = Course(
            code="CS-604",
            title="Artificial Intelligence & Neural Networks",
            category="AI & Machine Learning",
            description="Foundations of heuristic search, reinforcement learning, backpropagation, and modern transformer architectures.",
            thumbnail="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
            credits=4,
            rating=4.9,
            total_reviews=210,
            is_featured=True,
            lead_teacher_id=mentor1.id,
            syllabus_json=[
                {"module": 1, "title": "Heuristic Search & Adversarial Games", "hours": 8},
                {"module": 2, "title": "Supervised & Unsupervised Learning", "hours": 10},
                {"module": 3, "title": "Neural Networks & Backpropagation", "hours": 12},
                {"module": 4, "title": "Transformers & Attention Mechanisms", "hours": 10}
            ],
            schedule_info="Mon & Thu: 02:00 PM - 03:30 PM"
        )

        db.add_all([course1, course2, course3, course4])
        await db.flush()

        # 5. Subjects for Class CSE-A
        subj_dbms = Subject(
            code="CS601",
            name="Database Management Systems",
            credits=4,
            semester=6,
            class_id=class_cse_a.id,
            teacher_id=teacher1.id,
            syllabus_topics=["ER Model", "Relational Algebra", "SQL Queries", "Normalization (BCNF)", "B+ Indexing", "ACID Transactions"],
            notes_json=[
                {"title": "Unit 1: ER to Relational Schema Mapping", "url": "/notes/dbms_unit1.pdf", "uploaded": "2026-02-10"},
                {"title": "Unit 3: Functional Dependencies & Normal Forms", "url": "/notes/dbms_unit3.pdf", "uploaded": "2026-03-01"}
            ]
        )

        subj_algo = Subject(
            code="CS602",
            name="Design & Analysis of Algorithms",
            credits=4,
            semester=6,
            class_id=class_cse_a.id,
            teacher_id=mentor1.id,
            syllabus_topics=["Asymptotic Notation", "Divide & Conquer", "Dynamic Programming", "Dijkstra & Prim Algorithm", "NP Completeness"],
            notes_json=[
                {"title": "DP Masterclass: Knapsack & Longest Subsequence", "url": "/notes/algo_dp.pdf", "uploaded": "2026-02-15"}
            ]
        )

        subj_cloud = Subject(
            code="CS603",
            name="Cloud Computing & DevOps",
            credits=4,
            semester=6,
            class_id=class_cse_a.id,
            teacher_id=teacher3.id,
            syllabus_topics=["Virtualization & Containers", "Docker Compose", "Kubernetes Ingress & Pods", "Terraform AWS Modules", "GitHub Actions CI"],
            notes_json=[
                {"title": "Kubernetes Architecture & Manifests", "url": "/notes/cloud_k8s.pdf", "uploaded": "2026-02-20"}
            ]
        )

        subj_ai = Subject(
            code="CS604",
            name="Artificial Intelligence & Neural Nets",
            credits=4,
            semester=6,
            class_id=class_cse_a.id,
            teacher_id=mentor1.id,
            syllabus_topics=["A* Search", "Alpha-Beta Pruning", "Perceptron & MLP", "Loss Functions & Optimization", "CNNs & Vision"],
            notes_json=[
                {"title": "Neural Networks Backprop Mathematics", "url": "/notes/ai_math.pdf", "uploaded": "2026-03-05"}
            ]
        )

        db.add_all([subj_dbms, subj_algo, subj_cloud, subj_ai])
        await db.flush()

        # 6. Subject-Specific Assessment Configurations (Total Internal = 25 marks)
        cfg_dbms = SubjectAssessmentConfig(
            subject_id=subj_dbms.id,
            has_internal_test=True,
            internal_test_max=10.0,
            has_model_exam=True,
            model_exam_max=5.0,
            has_assignment=True,
            assignment_max=5.0,
            has_seminar=True,
            seminar_max=2.5,
            has_project=True,
            project_max=2.5,
            total_internal_target=25.0
        )

        cfg_algo = SubjectAssessmentConfig(
            subject_id=subj_algo.id,
            has_internal_test=True,
            internal_test_max=12.0,
            has_model_exam=True,
            model_exam_max=6.0,
            has_assignment=True,
            assignment_max=7.0,
            has_seminar=False,
            seminar_max=0.0,
            has_project=False,
            project_max=0.0,
            total_internal_target=25.0
        )

        cfg_cloud = SubjectAssessmentConfig(
            subject_id=subj_cloud.id,
            has_internal_test=True,
            internal_test_max=8.0,
            has_model_exam=True,
            model_exam_max=4.0,
            has_assignment=True,
            assignment_max=5.0,
            has_seminar=False,
            seminar_max=0.0,
            has_project=True,
            project_max=8.0,
            total_internal_target=25.0
        )

        cfg_ai = SubjectAssessmentConfig(
            subject_id=subj_ai.id,
            has_internal_test=True,
            internal_test_max=10.0,
            has_model_exam=True,
            model_exam_max=5.0,
            has_assignment=True,
            assignment_max=5.0,
            has_seminar=True,
            seminar_max=2.5,
            has_project=True,
            project_max=2.5,
            total_internal_target=25.0
        )

        db.add_all([cfg_dbms, cfg_algo, cfg_cloud, cfg_ai])
        await db.flush()

        # 7. Assignments
        assign_dbms = Assignment(
            subject_id=subj_dbms.id,
            title="Assignment 1: Complex SQL Queries & Index Tuning",
            description="Formulate window functions, recursive CTEs, and write query optimization execution plans in PostgreSQL.",
            max_score=100.0,
            due_date=datetime.utcnow() + timedelta(days=5),
            created_by=teacher1.id
        )

        assign_algo = Assignment(
            subject_id=subj_algo.id,
            title="Assignment 2: Dynamic Programming Problem Set",
            description="Implement Matrix Chain Multiplication and 0/1 Knapsack with runtime benchmark comparison.",
            max_score=100.0,
            due_date=datetime.utcnow() + timedelta(days=8),
            created_by=mentor1.id
        )

        db.add_all([assign_dbms, assign_algo])
        await db.flush()

        # Submissions
        subm_priya = AssignmentSubmission(
            assignment_id=assign_dbms.id,
            student_id=student_priya.id,
            submission_text="Comprehensive SQL query optimization benchmark submitted with index profiling charts.",
            score=96.0,
            teacher_feedback="Outstanding analytical depth. Query execution plan is clearly annotated.",
            ai_feedback="AI Evaluation: High semantic consistency, well-structured EXPLAIN ANALYZE traces, zero syntax defects.",
            ai_plagiarism_score=1.8,
            status="graded"
        )

        subm_rahul = AssignmentSubmission(
            assignment_id=assign_dbms.id,
            student_id=student_rahul.id,
            submission_text="Basic SQL queries executed. Encountered syntax difficulty in recursive CTE section.",
            score=62.0,
            teacher_feedback="Needs revision on recursive CTE concepts and indexing strategies.",
            ai_feedback="AI Evaluation: Basic query constructs correct. Recursive logic contains recursion limit omission.",
            ai_plagiarism_score=3.5,
            status="graded"
        )

        db.add_all([subm_priya, subm_rahul])
        await db.flush()

        # 8. Student Marks Calculation (Conforming strictly to Section 8 & 9)
        # Rahul Verma: Struggles with DBMS (Internal: 14/25, External Raw: 52/100 -> Converted: 39/75 -> Final: 53/100)
        # Priya: Excels across all subjects
        # Arjun: Solid performer

        # Marks for Rahul
        mark_rahul_dbms = StudentMark(
            student_id=student_rahul.id,
            subject_id=subj_dbms.id,
            semester=6,
            internal_test_score=5.5, # /10
            model_exam_score=2.5,   # /5
            assignment_score=3.5,   # /5
            seminar_score=1.5,      # /2.5
            project_score=1.0,      # /2.5
            internal_total_25=14.0, # /25
            external_raw_100=52.0,  # /100
            external_converted_75=39.0, # 52 * 0.75 = 39.0
            final_mark_100=53.0,    # 14 + 39 = 53.0
            letter_grade="B",
            grade_points=6.0,
            is_passed=True,
            remarks="Requires targeted tutoring in Normalization and Query Tuning"
        )

        mark_rahul_algo = StudentMark(
            student_id=student_rahul.id,
            subject_id=subj_algo.id,
            semester=6,
            internal_test_score=6.0, # /12
            model_exam_score=3.0,   # /6
            assignment_score=4.0,   # /7
            seminar_score=0.0,
            project_score=0.0,
            internal_total_25=13.0, # /25
            external_raw_100=48.0,  # /100
            external_converted_75=36.0, # 48 * 0.75 = 36.0
            final_mark_100=49.0,    # 13 + 36 = 49.0
            letter_grade="C",
            grade_points=5.0,
            is_passed=True,
            remarks="Weak in dynamic programming state space representation"
        )

        mark_rahul_cloud = StudentMark(
            student_id=student_rahul.id,
            subject_id=subj_cloud.id,
            semester=6,
            internal_test_score=6.0,
            model_exam_score=3.0,
            assignment_score=4.0,
            seminar_score=0.0,
            project_score=6.0,
            internal_total_25=19.0,
            external_raw_100=72.0,
            external_converted_75=54.0,
            final_mark_100=73.0,
            letter_grade="A",
            grade_points=8.0,
            is_passed=True,
            remarks="Good practical performance in Docker containers"
        )

        mark_rahul_ai = StudentMark(
            student_id=student_rahul.id,
            subject_id=subj_ai.id,
            semester=6,
            internal_test_score=5.0,
            model_exam_score=2.0,
            assignment_score=3.0,
            seminar_score=1.5,
            project_score=1.5,
            internal_total_25=13.0,
            external_raw_100=50.0,
            external_converted_75=37.5,
            final_mark_100=50.5,
            letter_grade="B",
            grade_points=6.0,
            is_passed=True,
            remarks="Needs reinforcement in Neural Network backpropagation math"
        )

        # Marks for Priya Sundaram (Topper)
        mark_priya_dbms = StudentMark(
            student_id=student_priya.id,
            subject_id=subj_dbms.id,
            semester=6,
            internal_test_score=9.5,
            model_exam_score=4.8,
            assignment_score=4.9,
            seminar_score=2.4,
            project_score=2.4,
            internal_total_25=24.0,
            external_raw_100=92.0,
            external_converted_75=69.0,
            final_mark_100=93.0,
            letter_grade="O",
            grade_points=10.0,
            is_passed=True,
            remarks="Exemplary mastery across database internals"
        )

        mark_priya_algo = StudentMark(
            student_id=student_priya.id,
            subject_id=subj_algo.id,
            semester=6,
            internal_test_score=11.5,
            model_exam_score=5.8,
            assignment_score=6.7,
            seminar_score=0.0,
            project_score=0.0,
            internal_total_25=24.0,
            external_raw_100=88.0,
            external_converted_75=66.0,
            final_mark_100=90.0,
            letter_grade="O",
            grade_points=10.0,
            is_passed=True,
            remarks="Exceptional algorithmic problem-solving"
        )

        mark_priya_cloud = StudentMark(
            student_id=student_priya.id,
            subject_id=subj_cloud.id,
            semester=6,
            internal_test_score=7.8,
            model_exam_score=3.9,
            assignment_score=4.8,
            seminar_score=0.0,
            project_score=7.8,
            internal_total_25=24.3,
            external_raw_100=90.0,
            external_converted_75=67.5,
            final_mark_100=91.8,
            letter_grade="O",
            grade_points=10.0,
            is_passed=True,
            remarks="Outstanding cloud architecture implementation"
        )

        mark_priya_ai = StudentMark(
            student_id=student_priya.id,
            subject_id=subj_ai.id,
            semester=6,
            internal_test_score=9.8,
            model_exam_score=4.9,
            assignment_score=4.8,
            seminar_score=2.5,
            project_score=2.5,
            internal_total_25=24.5,
            external_raw_100=94.0,
            external_converted_75=70.5,
            final_mark_100=95.0,
            letter_grade="O",
            grade_points=10.0,
            is_passed=True,
            remarks="Top score in AI & Neural Networks"
        )

        db.add_all([
            mark_rahul_dbms, mark_rahul_algo, mark_rahul_cloud, mark_rahul_ai,
            mark_priya_dbms, mark_priya_algo, mark_priya_cloud, mark_priya_ai
        ])
        await db.flush()

        # 9. Attendance Records (Last 30 days)
        # Rahul has ~68% attendance in DBMS, Priya has 95%
        print("📅 Generating historical attendance logs...")
        today = date.today()
        attendance_entries = []

        for day_offset in range(25):
            curr_d = today - timedelta(days=(25 - day_offset))
            if curr_d.weekday() >= 5: # Skip weekends
                continue

            # Rahul: absent periodically (creating weak attendance risk)
            rahul_dbms_status = "absent" if day_offset in (2, 5, 8, 12, 16, 20) else "present"
            rahul_algo_status = "absent" if day_offset in (4, 9, 14, 19) else "present"
            rahul_cloud_status = "present" if day_offset not in (7,) else "absent"
            rahul_ai_status = "absent" if day_offset in (3, 11, 17) else "present"

            attendance_entries.append(AttendanceRecord(
                student_id=student_rahul.id, subject_id=subj_dbms.id, class_id=class_cse_a.id,
                recorded_by=teacher1.id, date=curr_d, status=rahul_dbms_status
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_rahul.id, subject_id=subj_algo.id, class_id=class_cse_a.id,
                recorded_by=mentor1.id, date=curr_d, status=rahul_algo_status
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_rahul.id, subject_id=subj_cloud.id, class_id=class_cse_a.id,
                recorded_by=teacher3.id, date=curr_d, status=rahul_cloud_status
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_rahul.id, subject_id=subj_ai.id, class_id=class_cse_a.id,
                recorded_by=mentor1.id, date=curr_d, status=rahul_ai_status
            ))

            # Priya: exemplary attendance
            priya_status = "present" if day_offset != 10 else "absent"
            attendance_entries.append(AttendanceRecord(
                student_id=student_priya.id, subject_id=subj_dbms.id, class_id=class_cse_a.id,
                recorded_by=teacher1.id, date=curr_d, status=priya_status
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_priya.id, subject_id=subj_algo.id, class_id=class_cse_a.id,
                recorded_by=mentor1.id, date=curr_d, status=priya_status
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_priya.id, subject_id=subj_cloud.id, class_id=class_cse_a.id,
                recorded_by=teacher3.id, date=curr_d, status="present"
            ))
            attendance_entries.append(AttendanceRecord(
                student_id=student_priya.id, subject_id=subj_ai.id, class_id=class_cse_a.id,
                recorded_by=mentor1.id, date=curr_d, status="present"
            ))

        db.add_all(attendance_entries)
        await db.flush()

        # 10. Daily Cognitive Study Tips
        tips = [
            DailyStudyTip(
                title="Feynman Technique for Relational Algebra",
                content="Explain DBMS joins (Inner vs Left Outer) to a peer without technical jargon to expose conceptual blindspots.",
                category="Conceptual Clarity",
                icon="brain",
                active_date=today
            ),
            DailyStudyTip(
                title="Spaced Retrieval Practice in Algorithms",
                content="Solve 2 Dynamic Programming problems every morning before checking solution hints to build neural intuition.",
                category="Problem Solving",
                icon="code",
                active_date=today
            ),
            DailyStudyTip(
                title="Pomodoro Revision for Cloud Architecture",
                content="Dedicate two 25-minute sprint blocks to Kubernetes manifest debugging followed by 5 minutes of mindful recovery.",
                category="Time Management",
                icon="clock",
                active_date=today
            )
        ]
        db.add_all(tips)
        await db.commit()

        # 11. Run AI Intelligence Pre-computation
        print("🧠 Running AI Intelligence engine on initial cohort...")
        await ai_service.analyze_student_performance(db, student_rahul.id)
        await ai_service.analyze_student_performance(db, student_priya.id)

        print("✅ Database successfully initialized and seeded with rich academic data!")

if __name__ == "__main__":
    asyncio.run(seed_database())
