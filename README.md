## Telegram Channel CMS 

### Overview

The app allows users to post, edit, schedule messages, and create message templates for Telegram using the Telethon library.

The core feature is deep analytics, providing insights into engagement metrics, views, likes, commands, and other key interactions. The analytics dashboard continuously gathers and updates data from a given Telegram channel.

### Key Features

1. **Message Management**
    - **Post Messages**: Users can create and send messages to a Telegram channel.
    - **Edit Messages**: Modify previously posted messages.
    - **Schedule Messages**: Set specific times for messages to be automatically posted.
    - **Templates**: Save predefined message formats for quick posting.

2. **Analytics & Data Collection**
    - **Automated Data Gathering**:
        - Every hour, the system collects analytics data for every message in the monitored Telegram channel.
        - Real-time Data Fetching for the latest 30 messages.
        - Deleted Message Detection & Syncing:
            - Messages found in the database but missing in Telegram are marked as deleted to maintain synchronization. These messages stay in the database but are not visible to the user.

3. **Dashboard & Visualization**
    - Displays engagement metrics such as:
        - Views per message
        - Reactions (likes, dislikes, emojis, etc.)
        - Commands used (if applicable)
        - Overall engagement trends
    - Allows filtering and sorting of data for detailed analysis.

### Technical Stack

**Backend**
- Django – Web framework
- Django Ninja Extra – Fast API layer
- Telethon – Telegram API client for message management and data collection
- Celery and Celery Beat – Background cron tasks
- Redis – Messaging system for Celery

**Frontend**
- React
- MUI – Main frontend framework
- TipTapEditor – Text editor library

**Database**
- PostgreSQL / MySQL – Storing messages, analytics, and user data
- Sqlite for Celery Beat

### Deployment

**For development with Sqlite DB:**
- Clone project
- Create `.env.dev` from `env-template` template
- Create `.env` file in the `frontend` folder and add `VITE_BASE_URL=http://localhost:8020` to it.
- Install poetry and run `poetry install` in the root directory of the project
- Install redis
- Run `make migrate`, `make superuser`, and `make run_dev`

**For production:**

### TODO
- Large file attachments.
- Day and year sorting for Telegram channel views chart.
- Backend stores history of edits both for draft messages that haven't been posted and for published messages, but the functionality for viewing these edits is still not implemented.
