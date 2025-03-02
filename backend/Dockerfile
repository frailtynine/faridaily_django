FROM python:3.12-slim

WORKDIR /app
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH=/app/backend

RUN pip install --upgrade pip

COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root

COPY backend/ .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["poetry", "run", "gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8020", "--workers", "3"]
