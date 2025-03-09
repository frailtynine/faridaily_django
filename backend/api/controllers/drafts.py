from django.shortcuts import get_object_or_404
from ninja_extra import api_controller, route
from ninja_extra.permissions import IsAuthenticated
from ninja_jwt.authentication import JWTAuth

from api.models import DraftDB, DraftHistory
import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from api.schemas.drafts import (
    DraftDBSchema,
    DraftCreateSchema,
    DraftUpdateSchema
)


@api_controller('/drafts', auth=JWTAuth(), permissions=[IsAuthenticated])
class DraftController:
    @route.post('/create', response=DraftDBSchema)
    def create_draft(self, request, payload: DraftCreateSchema):
        user = request.user
        payload_dict = payload.dict()
        payload_dict['user'] = user
        draft = DraftDB.objects.create(**payload_dict)
        return draft

    @route.post('/save_file')
    def save_file(self, request):
        file = request.FILES['file']
        file_name = default_storage.save(
            os.path.join('media', file.name),
            ContentFile(file.read())
        )
        file_url = os.path.join(settings.MEDIA_URL, file_name)
        return {'file_url': file_url}

    @route.put('/{id}', response=DraftDBSchema)
    def update_draft(self, request, id: int, payload: DraftUpdateSchema):
        draft = get_object_or_404(DraftDB, pk=id)
        if payload.text != draft.text:
            DraftHistory.objects.create(
                draft=draft,
                text=payload.text,
                user=request.user
            )
        for key, value in payload.dict().items():
            setattr(draft, key, value)
        draft.save()
        return draft

    @route.get('/{id}', response=DraftDBSchema)
    def get_draft(self, request, id: int):
        draft = get_object_or_404(DraftDB, pk=id)
        return draft

    @route.delete('/{id}')
    def delete_draft(self, request, id: int):
        draft = get_object_or_404(DraftDB, pk=id)
        draft.delete()
        return

    @route.get('/', response=list[DraftDBSchema])
    def get_drafts(self, request):
        return DraftDB.objects.filter(
            is_published=False
        ).prefetch_related('edits')
