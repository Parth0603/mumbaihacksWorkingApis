from bson import ObjectId
from datetime import datetime
from app.config.database import get_database
from typing import List, Dict


class EducationService:
    """Service for education module management"""

    @staticmethod
    async def get_all_modules() -> List[Dict]:
        """Get all available learning modules"""
        db = get_database()
        modules = await db.education_modules.find({}).sort("order", 1).to_list(length=100)
        for mod in modules:
            mod["_id"] = str(mod["_id"])
            if mod.get("quiz_id"):
                mod["quiz_id"] = str(mod["quiz_id"])
        return modules

    @staticmethod
    async def get_module(module_id: str) -> Dict:
        """Get specific module details"""
        db = get_database()
        module = await db.education_modules.find_one({"_id": ObjectId(module_id)})
        if module:
            module["_id"] = str(module["_id"])
            if module.get("quiz_id"):
                module["quiz_id"] = str(module["quiz_id"])
        return module

    @staticmethod
    async def get_user_progress(user_id: str) -> List[Dict]:
        """Get user's learning progress across all modules"""
        db = get_database()
        progress = (
            await db.user_education_progress.find({"user_id": ObjectId(user_id)})
            .sort("updated_at", -1)
            .to_list(None)
        )
        for p in progress:
            p["_id"] = str(p["_id"])
            p["user_id"] = str(p["user_id"])
            p["module_id"] = str(p["module_id"])
        return progress

    @staticmethod
    async def start_module(user_id: str, module_id: str) -> Dict:
        """Start a new learning module"""
        db = get_database()
        # Check if already started
        existing = await db.user_education_progress.find_one(
            {"user_id": ObjectId(user_id), "module_id": ObjectId(module_id)}
        )
        if existing:
            return {
                "_id": str(existing["_id"]),
                "user_id": str(existing["user_id"]),
                "module_id": str(existing["module_id"]),
                "status": existing["status"],
            }
        # Create new progress record
        progress_doc = {
            "user_id": ObjectId(user_id),
            "module_id": ObjectId(module_id),
            "status": "started",
            "quiz_attempts": 0,
            "quiz_passed": False,
            "quiz_score": None,
            "completion_percentage": 0,
            "started_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.user_education_progress.insert_one(progress_doc)
        return {
            "_id": str(result.inserted_id),
            "user_id": str(user_id),
            "module_id": str(module_id),
            "status": "started",
        }

    @staticmethod
    async def submit_quiz(user_id: str, module_id: str, answers: Dict) -> Dict:
        """Submit quiz answers and calculate score"""
        db = get_database()
        # Get quiz
        module = await db.education_modules.find_one({"_id": ObjectId(module_id)})
        if not module or not module.get("quiz_id"):
            return {"error": "No quiz for this module", "status": 400}
        quiz = await db.quizzes.find_one({"_id": ObjectId(module["quiz_id"])})
        if not quiz:
            return {"error": "Quiz not found", "status": 404}
        # Score the quiz
        correct_count = 0
        for question_idx, answer in answers.items():
            q_idx = int(question_idx)
            if q_idx < len(quiz["questions"]):
                question = quiz["questions"][q_idx]
                if answer == question.get("correct_answer"):
                    correct_count += 1
        total_questions = len(quiz["questions"])
        score = (correct_count / total_questions * 100) if total_questions > 0 else 0
        passed = score >= quiz.get("passing_score", 70)
        # Update progress
        await db.user_education_progress.update_one(
            {"user_id": ObjectId(user_id), "module_id": ObjectId(module_id)},
            {
                "$set": {
                    "quiz_attempts": 1,  # Increment in real implementation
                    "quiz_passed": passed,
                    "quiz_score": int(score),
                    "status": "completed" if passed else "attempted",
                    "completion_percentage": int(score),
                    "completed_at": datetime.utcnow() if passed else None,
                    "updated_at": datetime.utcnow(),
                }
            },
            upsert=True,
        )
        # Award points if passed
        if passed:
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$inc": {"gamification_points": 50}},  # 50 points for module completion
            )
        return {
            "score": int(score),
            "passed": passed,
            "correct": correct_count,
            "total": total_questions,
            "message": f"You scored {int(score)}%!"
            + (" ✅ Module Completed!" if passed else " ❌ Try Again"),
        }

    @staticmethod
    async def get_quiz(module_id: str) -> Dict:
        """Get quiz for a module (without answers visible)"""
        db = get_database()
        module = await db.education_modules.find_one({"_id": ObjectId(module_id)})
        if not module or not module.get("quiz_id"):
            return {}
        quiz = await db.quizzes.find_one({"_id": ObjectId(module["quiz_id"])})
        if not quiz:
            return {}
        # Remove correct answers from questions
        questions_public = []
        for q in quiz.get("questions", []):
            q_copy = q.copy()
            q_copy.pop("correct_answer", None)  # Hide answer
            questions_public.append(q_copy)
        return {
            "quiz_id": str(quiz["_id"]),
            "module_id": str(module_id),
            "questions": questions_public,
            "total_questions": len(questions_public),
        }
