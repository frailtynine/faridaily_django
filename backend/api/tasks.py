from datetime import timedelta

from django.utils import timezone
from asgiref.sync import async_to_sync

from backend.celery_app import app
from api.models import DraftDB
from api.telegram.bot import send_message
from api.controllers.telegram import fetch_telegram_data


SCHEDULE_TIMEOUT_SECS = 60
CRAWL_TIMEOUT_SECS = 3600


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        SCHEDULE_TIMEOUT_SECS,
        publish_scheduled_posts.s(),
        name='publish_scheduled_posts'
    )
    sender.add_periodic_task(
        CRAWL_TIMEOUT_SECS,
        crawl_tg.s(),
        name='crawl_tg_every_hour'
    )


@app.task
def publish_scheduled_posts(test: bool = False):
    """
    Looks through database for unpublished posts, compares
    pub_date, publishes and sends to telegram.

    Posts with pub_date earlier than current time won't be published
    and should be rescheduled.

    Args: Pass test=True for testing without publishing to telegram.
    """
    # TODO: Think of additional checks to make sure post is ready to publish.
    current_time = timezone.now()
    five_mins_ago = current_time - timedelta(minutes=5)
    unpublished_posts = DraftDB.objects.filter(is_published=False)
    for post in unpublished_posts:
        if post.pub_date and five_mins_ago <= post.pub_date <= current_time:
            post.is_published = True
            post.save()
            if not test:
                async_to_sync(send_message)(post.text, post.media_url)
                return 'success!'


@app.task
def crawl_tg():
    """
    Gets fresh data from the telegram channel.

    Runs every hour.
    """
    try:
        fetch_telegram_data('albumsweekly')
    except Exception as e:
        raise e
