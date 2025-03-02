import { useState, useEffect } from "react";
import Editor from "../Editor/Editor";
import { Box, Button, Select, MenuItem, TextField, Chip } from "@mui/material";
import { fetchModels, postModel, updateModel } from "../../api";
import { TemplateCreateRequest, TemplateResponse } from "../../interface";
import { useComponent } from "../Main/Context";
import MainPage from "../Main/MainPage";
import DeleteButton from "./DeleteButton";


export default function TemplateEditor () {
  const [templateData, setTemplateData] = useState<TemplateCreateRequest>({
    title: '',
    text: '',
    position: 'middle'
  });
  const [id, setId] = useState<number>();
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);

  const {setCurrentComponent} = useComponent();
  
  useEffect(() => {
    fetchModels(`tg/template`)
    .then((templates) => setTemplates(templates))
    .catch((error) => {
      console.log(error);
    })
    
  }, [])

  const handleSubmit = async () => {
    if (id) {
      updateModel('tg/template', id, templateData)
      .then(() => {
        setCurrentComponent(<MainPage />);
      })
      .catch(error => {
        console.error(error);
      })
    } else {
      postModel('tg/template/create', templateData)
      .then(() => {
        setCurrentComponent(<MainPage />);
      })
      .catch(error => {
        console.error(error);
      })
    }
  }

  return (
    <Box
    sx={{ display: 'flex', flexDirection: 'row', gap: '16px',}}
  >
      {/* Editor */}
      <Box>
          <TextField
            sx={{ width: '100%', }}
            required
            label='Title'
            value={templateData.title}
            onChange={(e) => {
              setTemplateData((prevData) => ({
                ...prevData,
                title: e.target.value
              }))
            }}
          />
          <Editor 
            textValue={templateData.text}
            setTextValue={(value) => {
              setTemplateData((prevData) => ({
                ...prevData,
                text: value
              }))
            }}
            charLimit={4000}
            height='400px'
            width='100%'
          />
        <Box display="flex" justifyContent="flex-end" gap="10px" marginTop={'10px'}>
          {id && <DeleteButton endpoint={`tg/template`} id={id}/>}
          <Select
            size="small"
            value={templateData.position}
            onChange={(e) => setTemplateData((prevData) => ({
              ...prevData,
              position: e.target.value as 'header' | 'footer' | 'middle'
            }))}
          >
            <MenuItem value="header">Header</MenuItem>
            <MenuItem value="footer">Footer</MenuItem>
            <MenuItem value="middle">Middle</MenuItem>
          </Select>
          <Button variant="contained" size="small" onClick={() => setCurrentComponent(<MainPage/>)}>Cancel</Button>
          <Button variant="contained" size="small" onClick={() => handleSubmit()}>Save template</Button>
        </Box>
      </Box>

      {/* Templates list */}
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        {templates && templates.map((template) => (
          <Chip
            key={`template-${template.id}`}
            label={template.title}
            clickable
            onClick={() => {
              setTemplateData(template);
              setId(template.id);
            }}
          />
        ))}
      </Box>
    </Box>
  )
}