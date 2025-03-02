import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import TextEditor from "../Create/TextEditor";
import TemplateEditor from "../Create/TemplateEditor";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShortTextIcon from '@mui/icons-material/ShortText';
import { useComponent } from "../Main/Context";


export default function FloatButton () {
  const { setCurrentComponent } = useComponent();
  const speedDialMenu = [
    {name: 'Draft', element: TextEditor, icon: NewspaperIcon},
    {name: 'Template', element: TemplateEditor, icon: ShortTextIcon}
  ]

  const handleComponentChange = (Component: React.ElementType, props: any = {}) => {
    setCurrentComponent(<Component {...props}/>);
  };

  return (
    <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: 16  }}
        icon={<SpeedDialIcon />}
      >
        {speedDialMenu.map((action) => (
          <SpeedDialAction
            key={action.name}
            tooltipTitle={action.name}
            icon={<action.icon />}
            onClick={() => handleComponentChange(action.element)}
          />
        ))}
      </SpeedDial>
  )
}