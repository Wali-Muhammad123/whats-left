"""Recipe API request/response schemas (mobile-aligned)."""

from pydantic import Field

from sqlmodel import SQLModel


class RecipeIngredient(SQLModel):
    """Single ingredient line (detail view)."""

    name: str
    amount: str = ""
    have: bool = False


class RecipeInstruction(SQLModel):
    """Single instruction step."""

    step: int
    text: str
    time: str = ""


class RecipeCardResponse(SQLModel):
    """List/card shape for mobile (RecipeCardData)."""

    id: str
    title: str
    cuisine: str
    prep_time: str = Field(description="e.g. '20 min'")
    match_percent: int | None = None
    image_url: str | None = None
    saved: bool = False


class RecipeDetailResponse(SQLModel):
    """Detail view for mobile."""

    id: str
    title: str
    cuisine: str
    prep_time: str
    match_percent: int | None = None
    image_url: str | None = None
    servings: int = 2
    ingredients: list[RecipeIngredient] = Field(default_factory=list)
    instructions: list[RecipeInstruction] = Field(default_factory=list)


class RecipeGenerateRequest(SQLModel):
    """POST /recipes/generate body (stub)."""

    ingredients: list[str] = Field(default_factory=list)
    cuisine: str | None = Field(default=None, description="e.g. 'italian', 'any'")
    max_time_minutes: int | None = Field(default=None, ge=1, le=300)


class RecipeGenerateResponse(SQLModel):
    """POST /recipes/generate response (list of cards)."""

    recipes: list[RecipeCardResponse] = Field(default_factory=list)
