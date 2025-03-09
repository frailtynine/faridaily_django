import re
import os
from typing import Literal
from datetime import datetime

from django.conf import settings

from api.models import MessageDB


MESSAGE_QUERY_LITERAL = Literal['y', 'm', 'd']
MILLISECONDS_MILTIPLIER = 1000


def get_local_image_paths(
    images: list[str] | None
) -> list[str] | None:
    """Converts relative parts from DB to local paths."""
    if images:
        return [
            os.path.join(
                settings.BASE_DIR,
                'media',
                'media',
                os.path.basename(image)
            )
            for image in images
        ]
    return None


def preprocess_text(text: str):
    """
    Prepares text for the frontend editor.
    Newlines are turned into HTML with <p> tags with exception for blockquotes.

    Args:
        text (str): The input text with newlines.

    Returns:
        str: The processed text wrapped in <p> tags.
    """
    lines = text.split('\n')
    processed_lines = []
    prev_line = None
    for line in lines:
        if line.strip() == '<blockquote>' or line.strip() == '</blockquote>':
            processed_lines.append(line)
        elif line.strip():
            processed_lines.append(f'<p>{line.strip()}</p>')
        if line == '' and prev_line == '':
            processed_lines.append('<p></p>')
        prev_line = line
    return ''.join(processed_lines)


def remove_html_tags(text):
    """Remove html tags from a string"""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)


def sort_message_graph(
    messages: list[MessageDB],
    format: MESSAGE_QUERY_LITERAL
):
    """Sorts message date and views data for chart.

    Depending on the query returns data sorted by days,
    months or years.
    """
    message_graph = {
            "date": [],
            "views": []
        }
    for message in messages:
        date_args = {
            'd': {
                'year': message.pub_date.year,
                'month': message.pub_date.month,
                'day': message.pub_date.day
            },
            'm': {
                'year': message.pub_date.year,
                'month': message.pub_date.month,
                'day': 1
            },
            'y': {
                'year': message.pub_date.year,
                'month': 1,
                'day': 1
            }
        }
        # Unix time in milliseconds for the frontend.
        pub_date = datetime(
            **date_args[format]
        ).timestamp() * MILLISECONDS_MILTIPLIER
        if (
            message_graph['date']
            and message_graph['date'][-1] == pub_date
        ):
            message_graph['views'][-1] += message.views
        else:
            message_graph['date'].append(pub_date)
            message_graph['views'].append(message.views)
    return message_graph
