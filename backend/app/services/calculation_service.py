from typing import Dict, Any, Tuple
from app.models.academic import SubjectAssessmentConfig

class CalculationService:
    @staticmethod
    def calculate_internal_mark(
        scores: Dict[str, float],
        config: SubjectAssessmentConfig
    ) -> float:
        """
        Calculates internal mark out of 25 based on subject-specific assessment configuration.
        """
        internal_sum = 0.0
        
        if config.has_internal_test:
            raw_val = scores.get("internal_test_score", 0.0)
            # Cap at configured max
            internal_sum += min(raw_val, config.internal_test_max)
            
        if config.has_model_exam:
            raw_val = scores.get("model_exam_score", 0.0)
            internal_sum += min(raw_val, config.model_exam_max)
            
        if config.has_assignment:
            raw_val = scores.get("assignment_score", 0.0)
            internal_sum += min(raw_val, config.assignment_max)
            
        if config.has_seminar:
            raw_val = scores.get("seminar_score", 0.0)
            internal_sum += min(raw_val, config.seminar_max)
            
        if config.has_project:
            raw_val = scores.get("project_score", 0.0)
            internal_sum += min(raw_val, config.project_max)
            
        # Target internal is out of 25.0
        return round(min(internal_sum, 25.0), 2)

    @staticmethod
    def calculate_external_converted(external_raw_100: float) -> float:
        """
        Converts external examination mark out of 100 to 75 marks:
        Converted = External Mark * 0.75
        """
        raw = max(0.0, min(100.0, external_raw_100))
        return round(raw * 0.75, 2)

    @staticmethod
    def calculate_final_mark(internal_25: float, external_converted_75: float) -> Tuple[float, str, float, bool]:
        """
        Calculates Final Mark (/100) = Internal (/25) + Converted External (/75)
        Returns (final_mark, letter_grade, grade_point, is_passed)
        """
        final_mark = round(min(100.0, internal_25 + external_converted_75), 2)
        
        # Grading scale
        if final_mark >= 90:
            letter = "O"
            gp = 10.0
            passed = True
        elif final_mark >= 80:
            letter = "A+"
            gp = 9.0
            passed = True
        elif final_mark >= 70:
            letter = "A"
            gp = 8.0
            passed = True
        elif final_mark >= 60:
            letter = "B+"
            gp = 7.0
            passed = True
        elif final_mark >= 50:
            letter = "B"
            gp = 6.0
            passed = True
        elif final_mark >= 40:
            letter = "C"
            gp = 5.0
            passed = True
        else:
            letter = "F"
            gp = 0.0
            passed = False
            
        return final_mark, letter, gp, passed

calculation_service = CalculationService()
