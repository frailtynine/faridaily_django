PROJECT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
POETRY_RUN := poetry run python
MANAGE_DIR := $(PROJECT_DIR)/backend/manage.py
DJANGO_RUN := $(POETRY_RUN) $(MANAGE_DIR)
REACT_DIR := $(PROJECT_DIR)/frontend
BACKEND_DIR := $(PROJECT_DIR)/backend

include .env.dev
export

DEFAUL_GOAL := help

help:
	@echo "run-dev          Start app in dev mode"
	@echo "help             Show available commands"
	@echo "load_data        Load test json fixtures"

run_django:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) runserver 0.0.0.0:8020

run_react:
		cd $(REACT_DIR) && npm run dev

run_dev:
		./run_dev.sh 

superuser:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) createsuperuser

migrate:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) migrate

makemigrations:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) makemigrations

load_data:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) load_json_data

reset_db:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) flush --no-input
		cd $(PROJECT_DIR) && $(DJANGO_RUN) migrate
static:
		cd $(PROJECT_DIR) && $(DJANGO_RUN) collectstatic
test:
		cd $(PROJECT_DIR) && $(POETRY_RUN) -m pytest -p no:warnings

celery_worker:
		cd $(BACKEND_DIR) && celery -A backend worker --loglevel=info

celery_beat:
		cd $(BACKEND_DIR) && celery -A backend beat --loglevel=info

redis:
		redis-server
