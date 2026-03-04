"""Meal plan domain: stub API routes."""

from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.domains.meal_plan.schemas import DayPlan, MealPlanResponse, MealSlot

router = APIRouter()

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
SLOTS = ["Breakfast", "Lunch", "Dinner"]


@router.get("/meal-plan", response_model=MealPlanResponse)
def get_my_meal_plan(current_user: CurrentUser) -> MealPlanResponse:
    """Get current user's meal plan (stub: returns empty week structure)."""
    week_days = [
        DayPlan(
            day_label=day,
            date_iso=None,
            slots=[MealSlot(slot=s) for s in SLOTS],
        )
        for day in DAYS
    ]
    return MealPlanResponse(week_days=week_days)
