from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.domains.identity.models import User, UserCreate
from app.domains.identity.repository import IdentityRepository

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def init_db(session: Session) -> None:
    """Create initial data (e.g. first superuser) if missing."""
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        IdentityRepository.create(session=session, user_create=user_in)
