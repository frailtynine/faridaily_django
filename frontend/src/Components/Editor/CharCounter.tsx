import { Box } from "@mui/material";


interface CharCounterProps {
  editor: any;
  charLimit: number;
}

export default function CharCounter ({editor, charLimit}: CharCounterProps ) {
  if (!editor || !editor.storage || !editor.storage.characterCount) {
    return null;
  }
  const percentage = editor
  ? Math.round((100 / charLimit) * editor.storage.characterCount.characters())
  : 0

  return (
    <Box
      sx={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <div className={`character-count ${editor.storage.characterCount.characters() === charLimit ? 'character-count--warning' : ''}`}>
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
          style={{ marginRight: '8px' }}
        >
          <circle
            r="10"
            cx="10"
            cy="10"
            fill="#e9ecef"
          />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle
            r="6"
            cx="10"
            cy="10"
            fill="white"
          />
        </svg>
        
        {editor.storage.characterCount.characters()} / {charLimit}
      </div>
      </Box>
  )
}