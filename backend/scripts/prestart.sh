#! /usr/bin/env bash

set -e
set -x

# Ensure we run from app root (required when using Docker)
cd "${APP_ROOT:-/app}"
export PYTHONPATH="${APP_ROOT:-/app}:${PYTHONPATH:-}"

# Let the DB start
python app/backend_pre_start.py

# Run migrations (creates user_kitchen, recipe; drops item; adds user.phone)
alembic upgrade head

# Create initial data in DB
python app/initial_data.py
