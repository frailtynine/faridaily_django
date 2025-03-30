import AddIcon from '@mui/icons-material/Add';import { styled } from '@mui/material/styles';
import { Paper, CircularProgress, IconButton } from '@mui/material';
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
    <Paper
      sx={{ 
        width: '100px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      elevation={3}
    >
      <IconButton
        component='label'
        disabled={loading}
        sx={{
          borderRadius: 1,  // Maintain square corners
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'  // Light hover effect
          }
        }}    
      >
        {loading ? (
          <CircularProgress size={40} />
        ) : (
          <AddIcon sx={{ fontSize: 40 }} />
        )}
        <VisuallyHiddenInput
          sx={{
            width: '100%',
            height: '100%',
          }}
          type="file"
          accept="image/*"
          // multiple
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setLoading(true);
              handleSave(file)
              .then(() => setLoading(false));
            }
          }}
        />
      </IconButton>
    </Paper>
  );
}