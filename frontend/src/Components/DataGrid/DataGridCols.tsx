import { GridColDef } from "@mui/x-data-grid"
import dayjs from "dayjs"

const columns: GridColDef<any>[] = [
  {
    field: 'url',
    headerName: 'URL',
    width: 90,
    sortable: false,
    renderCell: (params) => {
      return (
        <a href={"https://t.me/albumsweekly/" + params.value} target={'_blank'}>Link</a>
      )
    }
  },
  {
    field: 'text',
    headerName: 'Text',
    width: 500,
    sortable: false,
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
    type: 'dateTime',
    headerName: 'Pub date',
    width: 120,
    valueGetter: (value) => dayjs(value).toDate(),
    valueFormatter: (value) => {
      const date = dayjs(value);
      return date.format('DD MMM YYYY');
    }

  },
  {
    field: 'views',
    headerName: 'Views',
    width: 90,
  },
  {
    field: 'forwards',
    headerName: 'Forwards',
    width: 90,
  },
  {
    field: 'comments',
    headerName: 'Comments',
    width: 90,
  },
  {
    field: 'emojis',
    headerName: 'Reactions',
    width: 90,
  },
  {
    field: 'er',
    headerName: 'ER',
    width: 90,
  },
]

export default columns;