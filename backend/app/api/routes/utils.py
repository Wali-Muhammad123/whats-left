from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser
from app.shared.schemas import Message
from app.utils import generate_test_email, send_email

router = APIRouter()


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")


@router.get("/health-check/")
async def health_check() -> bool:
    return True


@router.get("/kitchen-options")
def get_kitchen_options() -> dict:
    """Return ingredient categories, utensil ids, and dietary ids for mobile."""
    from app.domains.kitchen.constants import (
        DIETARY_IDS,
        INGREDIENT_OPTIONS,
        UTENSIL_IDS,
    )

    return {
        "ingredient_categories": list(INGREDIENT_OPTIONS.keys()),
        "ingredient_options": INGREDIENT_OPTIONS,
        "utensil_ids": UTENSIL_IDS,
        "dietary_ids": DIETARY_IDS,
    }
