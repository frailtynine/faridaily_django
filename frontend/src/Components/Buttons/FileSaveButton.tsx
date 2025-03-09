import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useState } from 'react';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileSaveButtonProps{
  handleSave: (file: File) => Promise<void>;
}

export default function FileSaveButton({handleSave}: FileSaveButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      disabled={loading}
    >
      Upload files
      <VisuallyHiddenInput
      type="file"
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) {
          setLoading(true);
          handleSave(file)
          .then(() => setLoading(false));
        }
      }}
      />
    </Button>
  );
}