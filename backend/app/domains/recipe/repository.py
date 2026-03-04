"""Recipe domain: persistence and list/generate stub."""

import uuid

from sqlmodel import Session, select

from app.domains.recipe.models import Recipe


class RecipeRepository:
    """Recipe CRUD and list with filters."""

    @staticmethod
    def get_by_id(*, session: Session, recipe_id: uuid.UUID) -> Recipe | None:
        return session.get(Recipe, recipe_id)

    @staticmethod
    def list_(
        *,
        session: Session,
        skip: int = 0,
        limit: int = 50,
        cuisine: str | None = None,
        max_time_minutes: int | None = None,
    ) -> list[Recipe]:
        stmt = select(Recipe).offset(skip).limit(limit)
        if cuisine and cuisine.lower() != "any":
            stmt = stmt.where(Recipe.cuisine.ilike(f"%{cuisine}%"))
        if max_time_minutes is not None:
            stmt = stmt.where(
                (Recipe.prep_time_minutes.is_(None))
                | (Recipe.prep_time_minutes <= max_time_minutes)
            )
        return list(session.exec(stmt).all())

    @staticmethod
    def create(
        *,
        session: Session,
        title: str,
        cuisine: str = "",
        prep_time_minutes: int | None = None,
        match_percent: int | None = None,
        image_url: str | None = None,
        servings: int = 2,
        ingredients: list[dict] | None = None,
        instructions: list[dict] | None = None,
    ) -> Recipe:
        recipe = Recipe(
            title=title,
            cuisine=cuisine,
            prep_time_minutes=prep_time_minutes,
            match_percent=match_percent,
            image_url=image_url,
            servings=servings,
            ingredients=ingredients or [],
            instructions=instructions or [],
        )
        session.add(recipe)
        session.commit()
        session.refresh(recipe)
        return recipe
