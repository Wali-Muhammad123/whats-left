"""Add user phone, drop item table, add user_kitchen

Revision ID: f4a1b2c3d4e5
Revises: 1a31ce608336
Create Date: 2025-03-03

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "f4a1b2c3d4e5"
down_revision = "1a31ce608336"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "user",
        sa.Column("phone", sa.String(length=32), nullable=True),
    )
    op.drop_table("item", if_exists=True)

    op.create_table(
        "user_kitchen",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ingredients", postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("utensils", postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("dietary_preferences", postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("household_size", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("has_completed_setup", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("pantry_updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id"),
    )

    op.create_table(
        "recipe",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("cuisine", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("prep_time_minutes", sa.Integer(), nullable=True),
        sa.Column("match_percent", sa.Integer(), nullable=True),
        sa.Column("image_url", sa.String(length=512), nullable=True),
        sa.Column("servings", sa.Integer(), nullable=False, server_default="2"),
        sa.Column("ingredients", postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("instructions", postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("recipe")
    op.drop_table("user_kitchen")

    op.create_table(
        "item",
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.drop_column("user", "phone")
