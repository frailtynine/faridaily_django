#!/bin/sh
echo "Waiting for database..."
while ! poetry run python manage.py check >/dev/null 2>&1; do
  sleep 1
done

echo "Applying database migrations..."
poetry run python manage.py migrate

echo "Checking for superuser..."
poetry run python manage.py createsuperuser --no-input

exec "$@"