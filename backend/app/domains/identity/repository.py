"""Identity domain: user persistence."""

import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.domains.identity.models import User, UserCreate, UserUpdate


class IdentityRepository:
    """User CRUD and auth queries."""

    @staticmethod
    def create(*, session: Session, user_create: UserCreate) -> User:
        db_obj = User.model_validate(
            user_create,
            update={"hashed_password": get_password_hash(user_create.password)},
        )
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)
        return db_obj

    @staticmethod
    def update(
        *, session: Session, db_user: User, user_in: UserUpdate
    ) -> User | Any:
        user_data = user_in.model_dump(exclude_unset=True)
        extra = {}
        if "password" in user_data:
            extra["hashed_password"] = get_password_hash(user_data.pop("password"))
        db_user.sqlmodel_update(user_data, update=extra)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user

    @staticmethod
    def get_by_id(*, session: Session, user_id: uuid.UUID) -> User | None:
        return session.get(User, user_id)

    @staticmethod
    def get_by_email(*, session: Session, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return session.exec(stmt).first()

    @staticmethod
    def authenticate(
        *, session: Session, email: str, password: str
    ) -> User | None:
        user = IdentityRepository.get_by_email(session=session, email=email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
