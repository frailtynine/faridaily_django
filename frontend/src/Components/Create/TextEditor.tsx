import { useState, useEffect } from "react";
import Editor from "../Editor/Editor";
import { Box, Button, Alert } from "@mui/material";
import { fetchModels, postModel, updateModel, postFile } from "../../api";
import { useComponent } from "../Main/Context";
import MainPage from "../Main/MainPage";
import DeleteButton from "./DeleteButton";
import { DraftResponse, DraftCreateRequest, MessageUpdateRequest, DraftUpdateRequest } from "../../interface";
import CustomDateTimePicker from "../Misc/CustomDatePicker";
import dayjs from "dayjs";
import FileSaveButton from "../Buttons/FileSaveButton";
import CustomImageList from "./CustomImageList";


interface TextEditorProps {
  id?: number;
}

export default function TextEditor ({id}: TextEditorProps) {
  const [textValue, setTextValue] = useState<string>('');
  const [draft, setDraft] = useState<DraftResponse>();
  const [images, setImages] = useState<string[]>([])
  const [pubDate, setPubDate] = useState<string>('');
  const {setCurrentComponent} = useComponent();
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchModels(`drafts/${id}`)
      .then((draftData) => {
        setTextValue(draftData.text);
        setDraft(draftData);
        setPubDate(draftData.pub_date);
        setImages(draftData.media_url || [])
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, [])

  const handleSave = async (file: File) => {
    postFile('drafts/save_file', file)
    .then((data) => {
      setImages((prev) => [...prev, data.file_url]);
    });
  }

  const handleDeleteImage = (indexToDelete: number) => {
    setImages(images.filter((_, index) => index !== indexToDelete))
  }

  const handleSubmit = async (text: string) => {
    setError(null);
    if (id && draft) {
      const payload: DraftResponse = {
        id: draft.id,
        pub_date: pubDate,
        text: textValue,
        media_url: images
      }
      updateModel('drafts', id, payload)
      .then(() => {
        setCurrentComponent(<MainPage />);
      })
      .catch((err: any) => {
        if (err.response?.status === 422) {
          setError('Some fields are not set properly.');
        } else {
          console.error(err);
        }
      })
    } else {
      const payload: DraftCreateRequest = {
        text: text,
        ...(pubDate && { pub_date: pubDate }),
        ...(images.length > 0 && { media_url: images })
      }
      postModel('drafts/create', payload)
      .then(() => {
        setCurrentComponent(<MainPage />);
      })
      .catch(err => {
        if (err.response?.status === 422) {
          setError('Some fields are not set properly.');
        } else {
          console.error(err);
        }
      })
    }
  }

  const handlePost = async (test: boolean) => {
    // Refactor to ternary
    const endpoint: string = test ? 'tg/send?test=true' : 'tg/send';
    const payload: MessageUpdateRequest = {
      text: textValue,
      images: images
    }
    postModel(endpoint, payload)
    .then(() => {
      if (id) {
        const payload: DraftUpdateRequest = {
          text: textValue,
          is_published: true,
        } 
        updateModel('drafts',id, payload)
        .catch(error => console.log(error))
      }
      setCurrentComponent(<MainPage />);
    })
    .catch(error => {
      console.error(error);
    })
  }

  return (
    <Box sx={{marginTop: '40px', width: { xs: '100%', md: '40vw' }}}>
      {error && <Alert severity="error" sx={{marginBottom: '10px'}}>{error}</Alert>}
      <CustomDateTimePicker
              label="Publication date"
              value={dayjs(pubDate) || null}
              onChange={(value) => {
                setPubDate(value?.toISOString() || '');
              }}
              disablePast={true}
            />
      <Editor
        textValue={textValue}
        setTextValue={setTextValue}
        charLimit={4000}
        height='70vh'
        width='100%'
        templates={true}
      />
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          gap: 2,
          mt: 2,
          '& > *': {  // Add this to prevent children from shrinking
            flexShrink: 0
          }
        }}>
        {images.length < 10 && <FileSaveButton handleSave={handleSave}/>}
        {images.length > 0 && <CustomImageList images={images} onDeleteImage={handleDeleteImage}/>}
      </Box>
      <Box display="flex" justifyContent="flex-end" padding="24px" gap="10px">
        <Button variant="contained" size="small" onClick={() => handlePost(true)}>Post to Test Channel</Button>
        <Button variant="contained" size="small" onClick={() => handlePost(false)}>Post to Telegram</Button>
        {id && <DeleteButton endpoint='drafts' id={id} />}
        <Button variant="contained" size="small" onClick={() => setCurrentComponent(<MainPage/>)}>Cancel</Button>
        <Button variant="contained" size="small" onClick={() => handleSubmit(textValue)}>Save draft</Button>
      </Box>
    </Box>
  )
}