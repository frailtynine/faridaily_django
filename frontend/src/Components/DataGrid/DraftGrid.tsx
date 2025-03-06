import { DataGrid } from "@mui/x-data-grid";
import { DraftResponse } from "../../interface";
import draftColums from "./DraftGridCols";
import { stripHtmlTags } from "./utils";
import { Box, Typography } from "@mui/material";
import { useComponent } from "../Main/Context";
import TextEditor from "../Create/TextEditor";


interface DraftGridProps {
  drafts: DraftResponse[];
}

export default function DraftGrid ({drafts}: DraftGridProps) {
  const {setCurrentComponent} = useComponent();

  const draftRows = drafts.map((draft) => ({
    id: `${draft.id}-draft`,
    text: {
      text: stripHtmlTags(draft.text).length > 100 ? stripHtmlTags(draft.text).substring(0, 100) + '...' : stripHtmlTags(draft.text),
      handleClick: () => setCurrentComponent(<TextEditor id={draft.id}/>) 
    },
    date: draft.pub_date || null,
  }));

  return (
    <Box sx={{width: {md: '710px', xs: '400px'} }}>
      <Typography>Draft posts</Typography>
      <DataGrid
        className="draft-grid"
        columns={draftColums}
        rows={draftRows}
        sx={{ overflowY: 'auto', overflowX: 'auto'}}
        disableColumnFilter
        sortingOrder={['desc', 'asc']}
        initialState={{
          pagination: {
          paginationModel: {
            pageSize: 5,
            page: 0
          },
          },
          sorting: {
            sortModel: [
              { field: 'date', sort: 'desc' }
            ],
          },
        }}
        pageSizeOptions={[5]}
        pagination
      />
    </Box>
  );

}