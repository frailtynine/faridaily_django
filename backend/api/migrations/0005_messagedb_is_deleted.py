# Generated by Django 5.1.4 on 2025-03-01 11:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_telegramtemplatedb_title_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='messagedb',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
