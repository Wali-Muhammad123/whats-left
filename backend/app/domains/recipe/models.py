"""Recipe domain: Recipe entity."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, JSON
from sqlmodel import Field, SQLModel


class Recipe(SQLModel, table=True):
    """Recipe (list/detail and for future AI generation)."""

    __tablename__ = "recipe"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    cuisine: str = Field(max_length=64, default="")
    prep_time_minutes: int | None = Field(default=None, ge=0)
    match_percent: int | None = Field(default=None, ge=0, le=100)
    image_url: str | None = Field(default=None, max_length=512)
    servings: int = Field(default=2, ge=1, le=50)
    ingredients: list[dict] = Field(
        default_factory=list,
        sa_column=Column(JSON, default=list, nullable=False),
    )
    instructions: list[dict] = Field(
        default_factory=list,
        sa_column=Column(JSON, default=list, nullable=False),
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
