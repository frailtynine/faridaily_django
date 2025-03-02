import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip } from "@mui/material";


interface LinkDialogProps {
  editor: any;
}


export default function LinkDialog ({editor}: LinkDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const handleOpen = () => {
    const lastUrl = editor.getAttributes('link').href;
    setUrl(lastUrl || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setOpen(false);
  };

  return (
    <div>
      <Chip onClick={handleOpen} label='Link'/>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}