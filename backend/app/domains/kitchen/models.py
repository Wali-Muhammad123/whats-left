"""Kitchen domain: UserKitchen entity (pantry + preferences)."""

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, JSON
from sqlmodel import Field, SQLModel


class UserKitchen(SQLModel, table=True):
    """Per-user kitchen: pantry ingredients, utensils, dietary prefs, household size."""

    __tablename__ = "user_kitchen"

    user_id: uuid.UUID = Field(
        primary_key=True,
        foreign_key="user.id",
        ondelete="CASCADE",
    )
    ingredients: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, default=list, nullable=False),
    )
    utensils: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, default=list, nullable=False),
    )
    dietary_preferences: list[str] = Field(
        default_factory=list,
        sa_column=Column(JSON, default=list, nullable=False),
    )
    household_size: int = Field(default=2, ge=1, le=20)
    has_completed_setup: bool = Field(default=False)
    pantry_updated_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
    )
