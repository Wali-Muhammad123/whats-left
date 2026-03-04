"""Recipe domain: API routes."""

import uuid

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import CurrentUser, SessionDep
from app.domains.recipe.models import Recipe
from app.domains.recipe.repository import RecipeRepository
from app.domains.recipe.schemas import (
    RecipeCardResponse,
    RecipeDetailResponse,
    RecipeGenerateRequest,
    RecipeGenerateResponse,
    RecipeIngredient,
    RecipeInstruction,
)

router = APIRouter()


def _prep_time_str(minutes: int | None) -> str:
    if minutes is None:
        return ""
    return f"{minutes} min"


def _recipe_to_card(recipe: Recipe, saved: bool = False) -> RecipeCardResponse:
    return RecipeCardResponse(
        id=str(recipe.id),
        title=recipe.title,
        cuisine=recipe.cuisine or "",
        prep_time=_prep_time_str(recipe.prep_time_minutes),
        match_percent=recipe.match_percent,
        image_url=recipe.image_url,
        saved=saved,
    )


def _recipe_to_detail(recipe: Recipe) -> RecipeDetailResponse:
    ingredients = [
        RecipeIngredient(
            name=item.get("name", ""),
            amount=item.get("amount", ""),
            have=item.get("have", False),
        )
        for item in (recipe.ingredients or [])
    ]
    instructions = [
        RecipeInstruction(
            step=item.get("step", i + 1),
            text=item.get("text", ""),
            time=item.get("time", ""),
        )
        for i, item in enumerate(recipe.instructions or [])
    ]
    return RecipeDetailResponse(
        id=str(recipe.id),
        title=recipe.title,
        cuisine=recipe.cuisine or "",
        prep_time=_prep_time_str(recipe.prep_time_minutes),
        match_percent=recipe.match_percent,
        image_url=recipe.image_url,
        servings=recipe.servings,
        ingredients=ingredients,
        instructions=instructions,
    )


@router.get("/", response_model=list[RecipeCardResponse])
def list_recipes(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    cuisine: str | None = Query(None),
    max_time: int | None = Query(None, ge=1, le=300),
) -> list[RecipeCardResponse]:
    """List recipes with optional filters."""
    recipes = RecipeRepository.list_(
        session=session,
        skip=skip,
        limit=limit,
        cuisine=cuisine,
        max_time_minutes=max_time,
    )
    return [_recipe_to_card(r) for r in recipes]


@router.get("/{recipe_id}", response_model=RecipeDetailResponse)
def get_recipe(
    session: SessionDep,
    current_user: CurrentUser,
    recipe_id: uuid.UUID,
) -> RecipeDetailResponse:
    """Get recipe by id."""
    recipe = RecipeRepository.get_by_id(session=session, recipe_id=recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return _recipe_to_detail(recipe)


@router.post("/generate", response_model=RecipeGenerateResponse)
def generate_recipes(
    session: SessionDep,
    current_user: CurrentUser,
    body: RecipeGenerateRequest,
) -> RecipeGenerateResponse:
    """Generate recipes from pantry (stub: returns empty or existing list)."""
    recipes = RecipeRepository.list_(
        session=session,
        skip=0,
        limit=20,
        cuisine=body.cuisine,
        max_time_minutes=body.max_time_minutes,
    )
    return RecipeGenerateResponse(
        recipes=[_recipe_to_card(r) for r in recipes],
    )
