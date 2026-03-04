"""Model registry: import all domain models so SQLModel.metadata is populated for Alembic."""

from sqlmodel import SQLModel

# Import domain models so their tables are registered on SQLModel.metadata
from app.domains.identity.models import User  # noqa: F401
from app.domains.kitchen.models import UserKitchen  # noqa: F401
from app.domains.recipe.models import Recipe  # noqa: F401

__all__ = ["SQLModel"]
