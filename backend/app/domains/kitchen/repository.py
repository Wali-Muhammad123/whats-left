"""Kitchen domain: persistence."""

import uuid
from datetime import datetime, timezone

from sqlmodel import Session, select

from app.domains.kitchen.models import UserKitchen


class KitchenRepository:
    """UserKitchen get/upsert."""

    @staticmethod
    def get_by_user_id(*, session: Session, user_id: uuid.UUID) -> UserKitchen | None:
        return session.get(UserKitchen, user_id)

    @staticmethod
    def get_or_create(
        *, session: Session, user_id: uuid.UUID
    ) -> UserKitchen:
        kitchen = KitchenRepository.get_by_user_id(session=session, user_id=user_id)
        if kitchen is not None:
            return kitchen
        kitchen = UserKitchen(user_id=user_id)
        session.add(kitchen)
        session.commit()
        session.refresh(kitchen)
        return kitchen

    @staticmethod
    def upsert(
        *,
        session: Session,
        user_id: uuid.UUID,
        ingredients: list[str] | None = None,
        utensils: list[str] | None = None,
        dietary_preferences: list[str] | None = None,
        household_size: int | None = None,
        has_completed_setup: bool | None = None,
        touch_pantry_updated: bool = False,
    ) -> UserKitchen:
        kitchen = KitchenRepository.get_or_create(session=session, user_id=user_id)
        if ingredients is not None:
            kitchen.ingredients = ingredients
            if touch_pantry_updated:
                kitchen.pantry_updated_at = datetime.now(timezone.utc)
        if utensils is not None:
            kitchen.utensils = utensils
        if dietary_preferences is not None:
            kitchen.dietary_preferences = dietary_preferences
        if household_size is not None:
            kitchen.household_size = household_size
        if has_completed_setup is not None:
            kitchen.has_completed_setup = has_completed_setup
        session.add(kitchen)
        session.commit()
        session.refresh(kitchen)
        return kitchen
