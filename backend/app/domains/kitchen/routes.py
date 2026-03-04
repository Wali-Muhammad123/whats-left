"""Kitchen domain: API routes."""

from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentUser, SessionDep
from app.domains.kitchen.repository import KitchenRepository
from app.domains.kitchen.schemas import KitchenResponse, KitchenUpdate

router = APIRouter()


def _to_response(kitchen) -> KitchenResponse:
    return KitchenResponse(
        ingredients=kitchen.ingredients or [],
        utensils=kitchen.utensils or [],
        dietary_preferences=kitchen.dietary_preferences or [],
        household_size=kitchen.household_size,
        has_completed_setup=kitchen.has_completed_setup,
        pantry_last_updated=kitchen.pantry_updated_at,
    )


@router.get("/kitchen", response_model=KitchenResponse)
def get_my_kitchen(
    session: SessionDep,
    current_user: CurrentUser,
) -> KitchenResponse:
    """Get current user's kitchen (pantry + preferences). Returns defaults if not set."""
    kitchen = KitchenRepository.get_or_create(
        session=session,
        user_id=current_user.id,
    )
    return _to_response(kitchen)


@router.patch("/kitchen", response_model=KitchenResponse)
def update_my_kitchen(
    session: SessionDep,
    current_user: CurrentUser,
    body: KitchenUpdate,
) -> KitchenResponse:
    """Update current user's kitchen. Only provided fields are updated."""
    data = body.model_dump(exclude_unset=True)
    touch_pantry = "ingredients" in data
    kitchen = KitchenRepository.upsert(
        session=session,
        user_id=current_user.id,
        ingredients=data.get("ingredients"),
        utensils=data.get("utensils"),
        dietary_preferences=data.get("dietary_preferences"),
        household_size=data.get("household_size"),
        has_completed_setup=data.get("has_completed_setup"),
        touch_pantry_updated=touch_pantry,
    )
    return _to_response(kitchen)
