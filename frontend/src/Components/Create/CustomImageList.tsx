import { IconButton, Box, Paper } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from "../../api";

interface ImageListProps {
  images: string[];
  onDeleteImage: (index: number) => void; 
}

export default function CustomImageList({images, onDeleteImage}: ImageListProps) {
  return (
    <Box
      sx={{display: 'flex', flexDirection: 'row', gap: 2}}
    >
      {images.map((image, index) => (
        <Paper
          sx={{ width: '100px', height: '100px', position: 'relative' }}
        >
          <IconButton
            onClick={() => onDeleteImage(index)}
            sx={{
              position: 'absolute',
              right: 4,
              top: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              padding: '4px',
              zIndex: 2
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <img 
            src={`${BASE_URL}${image}`} 
            alt={`image-${index}`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Paper>
      ))}
    </Box>
  )
}