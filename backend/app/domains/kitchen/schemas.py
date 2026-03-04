"""Kitchen API request/response schemas (mobile-aligned)."""

from datetime import datetime

from pydantic import Field

from sqlmodel import SQLModel


class KitchenBase(SQLModel):
    """Kitchen payload (partial update)."""

    ingredients: list[str] | None = Field(default=None, description="Pantry ingredients")
    utensils: list[str] | None = Field(default=None, description="Utensil ids")
    dietary_preferences: list[str] | None = Field(
        default=None,
        description="Dietary preference ids",
    )
    household_size: int | None = Field(default=None, ge=1, le=20)
    has_completed_setup: bool | None = Field(default=None)


class KitchenUpdate(KitchenBase):
    """PATCH body for /users/me/kitchen."""

    pass


class KitchenResponse(SQLModel):
    """GET /users/me/kitchen response (matches mobile store shape)."""

    ingredients: list[str] = Field(default_factory=list)
    utensils: list[str] = Field(default_factory=list)
    dietary_preferences: list[str] = Field(default_factory=list)
    household_size: int = 2
    has_completed_setup: bool = False
    pantry_last_updated: datetime | None = Field(
        default=None,
        description="Alias for pantry_updated_at for mobile",
    )
