from fastapi import APIRouter

from app.api.routes import utils
from app.domains.identity.routes import login_router, users_router
from app.domains.kitchen.routes import router as kitchen_router
from app.domains.meal_plan.routes import router as meal_plan_router
from app.domains.recipe.routes import router as recipe_router

api_router = APIRouter()
api_router.include_router(login_router, tags=["login"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(kitchen_router, prefix="/users/me", tags=["kitchen"])
api_router.include_router(meal_plan_router, prefix="/users/me", tags=["meal-plan"])
api_router.include_router(recipe_router, prefix="/recipes", tags=["recipes"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
