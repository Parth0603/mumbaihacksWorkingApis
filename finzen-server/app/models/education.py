from pydantic import BaseModel
from typing import List, Optional

class EducationModule(BaseModel):
    id: str
    title: str
    completed: bool

class EducationModulesResponse(BaseModel):
    modules: List[EducationModule]

class ModuleDetailResponse(BaseModel):
    id: str
    title: str
    content: str
    quiz: List[dict]

class SubmitQuizRequest(BaseModel):
    answers: List[str]

class QuizResultResponse(BaseModel):
    score: int
    passed: bool