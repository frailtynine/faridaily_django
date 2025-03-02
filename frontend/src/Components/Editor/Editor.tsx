import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import { Chip, Box } from "@mui/material";
import CharCounter from "./CharCounter";
import LinkDialog from "./LinkDialog";
import TemplateList from "./TemplateList";

interface EditorProps {
  textValue: string;
  setTextValue: (value: string) => void;
  charLimit?: number;
  width?: string;
  height?: string;
  templates?: boolean;
}

const Spoiler = Highlight.extend({
  renderHTML({ HTMLAttributes }) {
    return ['tg-spoiler', HTMLAttributes, 0]
  },
  parseHTML() {
    return [{tag: 'tg-spoiler'}]
  }
})

export default function Editor ({ 
  textValue, setTextValue, charLimit=4000, width='auto', height='auto', templates=false
}: EditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: false,
        protocols: ['https'],
      }),
      CharacterCount.configure({
        limit: charLimit,
      }),
      Underline,
      Spoiler,
    ],
    content: textValue,
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      setTextValue(editor.getHTML());
    },
  });


  
  useEffect(() => {
    if (editor && textValue !== editor.getHTML()) {
      editor.commands.setContent(textValue);
    }
  }, [textValue, editor]);
  
  if (!editor) {
    return null
  }
  
  return (
    <Box sx={{ marginTop: '10px' }}>
      <Box sx={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Chip onClick={() => editor.chain().focus().toggleBold().run()} label='B' />
        <Chip onClick={() => editor.chain().focus().toggleItalic().run()} label='I' />
        <Chip onClick={() => editor.chain().focus().toggleStrike().run()}  label='S'/>
        <Chip onClick={() => editor.chain().focus().toggleUnderline().run()} label='U'/>
        <Chip onClick={() => editor.chain().focus().toggleHighlight().run()} label='Spoiler' />
        <Chip onClick={() => editor.chain().focus().toggleBlockquote().run()} label='Quote' />
        <LinkDialog editor={editor} />
        {templates && <TemplateList editor={editor}/>}
        {charLimit && editor.storage.characterCount && <CharCounter editor={editor} charLimit={charLimit} />}
      </Box>
      <Box
        sx={{
          textAlign: 'left',
          minHeight: '200px',
          height: height,
          width: width,  
          border: '1px solid #ccc',  
          borderRadius: '8px',  
          backgroundColor: '#fff',
          whiteSpace: 'pre-wrap', 
          overflow: 'auto',
          '& .ProseMirror': {
            minHeight: '200px', 
            outline: 'none',  
            fontFamily: 'Roboto, sans-serif',  
            fontSize: '16px',
          },
          '& tg-spoiler': {
            backgroundColor: 'yellow'
          }
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
} 