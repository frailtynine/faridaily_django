from django.utils import timezone
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ChannelDB(models.Model):
    channel_name = models.CharField(unique=True, max_length=200)
    followers = models.IntegerField(default=0)
    growth_graph = models.JSONField()
    last_refresh = models.DateTimeField(default=timezone.now)


class MessageDB(models.Model):
    tg_id = models.IntegerField(unique=True, null=False)
    pub_date = models.DateTimeField()
    views = models.IntegerField(default=0)
    forwards = models.IntegerField(default=0)
    reactions = models.IntegerField(default=0)
    replies = models.IntegerField(default=0)
    post_author = models.TextField(null=True)
    text = models.TextField(max_length=15000)
    last_edit = models.DateTimeField(null=True)
    is_deleted = models.BooleanField(default=False)


class MessageHistory(models.Model):
    text = models.TextField(max_length=15000)
    edit_date = models.DateTimeField()
    message = models.ForeignKey(
        MessageDB,
        on_delete=models.CASCADE,
        related_name='edits'
    )


class DraftDB(models.Model):
    pub_date = models.DateTimeField(null=True)
    text = models.TextField()
    is_published = models.BooleanField(default=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='drafts',
        null=True
    )


class DraftHistory(models.Model):
    draft = models.ForeignKey(
        DraftDB,
        on_delete=models.CASCADE,
        related_name='edits'
    )
    text = models.TextField()
    edit_date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='draft_edits',
        null=True
    )


class Position(models.TextChoices):
    FOOTER = 'FOOTER', 'footer'
    HEADER = 'HEADER', 'header'
    MIDDLE = 'MIDDLE', 'middle'


class TelegramTemplateDB(models.Model):
    title = models.CharField(max_length=150)
    position = models.CharField(max_length=10, choices=Position.choices)
    text = models.TextField()
