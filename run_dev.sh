#!/bin/bash


make celery_worker &
make celery_beat &
make run_django &
make run_react &
make redis &

# Trap SIGINT and SIGTERM to stop background processes
trap 'kill $(jobs -p)' SIGINT SIGTERM

# Wait for all background processes to finish
wait