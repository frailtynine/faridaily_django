import { GridColDef } from "@mui/x-data-grid";

const draftColums: GridColDef<any>[] = [
  {
    field: 'text',
    headerName: 'Text',
    maxWidth: 400,
    minWidth: 280,
    renderCell: (params) => {
      const {text, handleClick } = params.value
      return (
        <div onClick={handleClick}>
          {text}
        </div>
      )
    }
  },
  {
    field: 'date',
    headerName: 'Pub Date',
    type: 'dateTime',
    width: 120,
    valueGetter: (value) => value ? new Date(value) : null,
    valueFormatter: (value: Date | null) => {
      if (value) {
        return value.toLocaleDateString('ru-ru', { year: 'numeric', month: 'short', day: 'numeric' })
      }
      return '';
    }
  },
]

export default draftColums;