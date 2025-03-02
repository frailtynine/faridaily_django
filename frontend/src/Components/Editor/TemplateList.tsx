import { fetchModels } from "../../api";
import { useEffect, useState } from "react";
import { TemplateResponse } from "../../interface";
import { Select, MenuItem, InputLabel, FormControl, Box } from "@mui/material";

interface TemplateListProps {
  editor: any;
}

export default function TemplateList ({editor}: TemplateListProps) {
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>();

  useEffect(() => {
    fetchModels(`tg/template`)
    .then((templates) => setTemplates(templates))
    .catch((error) => {
      console.log(error);
    })
  } ,[])

  return (
  <Box sx={{width: "120px"}}>
    <FormControl fullWidth>
      <InputLabel id="select-label">Template</InputLabel>
      <Select
        size="small"
        labelId="select-label"
        value=''
        onChange={(e) => {
          const foundTemplate = templates.find(template => template.title === e.target.value);
          if (foundTemplate) {
            setSelectedTemplate(selectedTemplate);
          }
        }}
      >
        {templates.map((template) => (
        <MenuItem key={template.id} value={template.title} onClick={() => {
          if (template.text) {
            editor.chain().focus().insertContent(template.text).run()
          }
        }}>
          {template.title}
        </MenuItem>
        ))}
      </Select>
    </FormControl>

  </Box>
  )
}