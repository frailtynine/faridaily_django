import { useState, useEffect } from "react";
import Editor from "../Editor/Editor";
import { Box, Button } from "@mui/material";
import { fetchModels, updateModel } from "../../api";
import { useComponent } from "../Main/Context";
import MainPage from "../Main/MainPage";
import { MessageUpdateRequest } from "../../interface";
// import DeleteButton from "./DeleteButton";


interface MessageEditorProps {
  id: number;
}

export default function MessageEditor ({id}: MessageEditorProps) {
  const [textValue, setTextValue] = useState<string>('');
  const {setCurrentComponent} = useComponent();
  
  useEffect(() => {
    fetchModels(`tg/messages/${id}`)
    .then((messageData) => {
      setTextValue(messageData.text);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  const handleSubmit = async () => {
    console.log(textValue);
    const payload: MessageUpdateRequest = {
      text: textValue
    }
    updateModel('tg/messages', id, payload)
    .then(() => {
      setCurrentComponent(<MainPage />);
    })
    .catch((error) => {
      console.error(error);
    })
  }

  return (
    <Box sx={{ width: { xs: '100%', md: '40vw' }}}>
      <Editor
        textValue={textValue}
        setTextValue={setTextValue}
        charLimit={4000}
        height='70vh'
        width='100%'
        templates={true}
      />
      <Box display="flex" justifyContent="flex-end" padding="24px" gap="10px">
        {/* {id && <DeleteButton endpoint='messages' id={id} />} */}
        <Button variant="contained" size="small" onClick={() => setCurrentComponent(<MainPage/>)}>Cancel</Button>
        <Button variant="contained" size="small" onClick={() => handleSubmit()}>Update</Button>
      </Box>
    </Box>
  )
}