from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from app.services.education import EducationService
from app.utils.dependencies import get_current_user
from bson import ObjectId

router = APIRouter()


@router.get("/modules", status_code=status.HTTP_200_OK)
async def get_modules():
    """Get all learning modules"""
    try:
        modules = await EducationService.get_all_modules()
        return {"total": len(modules), "modules": modules}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching modules: {str(e)}",
        )


@router.get("/modules/{module_id}", status_code=status.HTTP_200_OK)
async def get_module(module_id: str):
    """Get specific module details"""
    try:
        module = await EducationService.get_module(module_id)
        if not module:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
        return module
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching module: {str(e)}",
        )


@router.get("/progress", status_code=status.HTTP_200_OK)
async def get_progress(user_id: str = Depends(get_current_user)):
    """Get user's learning progress"""
    try:
        progress = await EducationService.get_user_progress(user_id)
        return {"progress": progress}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching progress: {str(e)}",
        )


@router.post("/modules/{module_id}/start", status_code=status.HTTP_200_OK)
async def start_module(module_id: str, user_id: str = Depends(get_current_user)):
    """Start learning a module"""
    try:
        result = await EducationService.start_module(user_id, module_id)
        if "error" in result:
            raise HTTPException(status_code=result.get("status", 500), detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error starting module: {str(e)}",
        )


@router.get("/modules/{module_id}/quiz", status_code=status.HTTP_200_OK)
async def get_quiz(module_id: str):
    """Get quiz for a module"""
    try:
        quiz = await EducationService.get_quiz(module_id)
        if not quiz:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
        return quiz
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching quiz: {str(e)}",
        )


@router.post("/modules/{module_id}/quiz", status_code=status.HTTP_200_OK)
async def submit_quiz(module_id: str, answers: dict, user_id: str = Depends(get_current_user)):
    """Submit quiz answers"""
    try:
        result = await EducationService.submit_quiz(user_id, module_id, answers)
        if "error" in result:
            raise HTTPException(status_code=result.get("status", 500), detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting quiz: {str(e)}",
        )
