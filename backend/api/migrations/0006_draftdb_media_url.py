# Generated by Django 5.1.4 on 2025-03-09 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_messagedb_is_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='draftdb',
            name='media_url',
            field=models.JSONField(null=True),
        ),
    ]
