class EducationService:
    async def get_modules(self, user_id: str):
        """Get education modules"""
        return {
            "modules": [
                {"id": "1", "title": "Investment Basics", "completed": False},
                {"id": "2", "title": "Risk Management", "completed": False}
            ]
        }
    
    async def get_module_detail(self, module_id: str):
        """Get module details"""
        return {
            "id": module_id,
            "title": "Investment Basics",
            "content": "Learn about investments",
            "quiz": []
        }
    
    async def submit_quiz(self, user_id: str, module_id: str, quiz_data):
        """Submit quiz"""
        return {"score": 80, "passed": True}