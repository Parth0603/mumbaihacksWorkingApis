from fastapi import APIRouter, Depends
from app.models.education import EducationModulesResponse, ModuleDetailResponse, SubmitQuizRequest, QuizResultResponse
from app.services.education_service import EducationService
# FIX: Use get_current_user from dependencies (Header-based) instead of auth (HTTPBearer)
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/education", tags=["Education"])
education_service = EducationService()

@router.get("/modules", response_model=EducationModulesResponse)
async def get_modules(current_user: str = Depends(get_current_user)):
    return await education_service.get_modules(current_user)

@router.get("/modules/{module_id}", response_model=ModuleDetailResponse)
async def get_module_detail(
    module_id: str,
    current_user: str = Depends(get_current_user)
):
    return await education_service.get_module_detail(module_id)

@router.post("/modules/{module_id}/quiz", response_model=QuizResultResponse)
async def submit_quiz(
    module_id: str,
    quiz_data: SubmitQuizRequest,
    current_user: str = Depends(get_current_user)
):
    return await education_service.submit_quiz(current_user, module_id, quiz_data)