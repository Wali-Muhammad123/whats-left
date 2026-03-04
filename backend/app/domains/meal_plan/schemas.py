"""Meal plan API schemas (stub, mobile-aligned)."""

from pydantic import Field

from sqlmodel import SQLModel


class MealSlot(SQLModel):
    """Single meal slot (e.g. Breakfast, Lunch, Dinner)."""

    slot: str = Field(description="e.g. Breakfast, Lunch, Dinner")
    recipe_id: str | None = None
    label: str | None = None


class DayPlan(SQLModel):
    """One day in the weekly plan."""

    day_label: str = Field(description="e.g. Mon, Tue")
    date_iso: str | None = Field(default=None, description="YYYY-MM-DD")
    slots: list[MealSlot] = Field(default_factory=list)


class MealPlanResponse(SQLModel):
    """GET /users/me/meal-plan response (stub)."""

    week_days: list[DayPlan] = Field(default_factory=list)
