import { DataGrid } from "@mui/x-data-grid";
import { MessageResponse } from "../../interface";
import { CircularProgress, TextField, Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import columns from "./DataGridCols";
import { stripHtmlTags } from "./utils";
import { useComponent } from "../Main/Context";
import MessageEditor from "../Create/MessageEditor";
import CustomDateTimePicker from "../Misc/CustomDatePicker";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { downloadXlsx } from "./utils";


interface MainDataGridProps {
  channelCount: number;
  messages: MessageResponse[];
}

export default function MainDataGrid({channelCount, messages}: MainDataGridProps) {
  
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const {setCurrentComponent} = useComponent();
  
  
  useEffect(() => {
    const messagesRows = messages.map(message => ({
      id: `${message.tg_id}-message`,
      url: message.tg_id,
      type: 'message',
      text: {
      text: stripHtmlTags(message.text).length > 100 ? stripHtmlTags(message.text).substring(0, 100) + '...' : stripHtmlTags(message.text),
      handleClick: () => setCurrentComponent(<MessageEditor id={message.tg_id}/>) 
      },      
      date: message.pub_date,
      views: message.views,
      forwards: message.forwards,
      comments: message.replies,
      emojis: message.reactions,
      er: parseFloat((((message.replies + message.forwards + message.reactions) * 100) / channelCount).toFixed(2)),
    }));

    setRows(messagesRows);
    setLoading(false);
  }, [messages, channelCount]);

  
  const filteredRows = rows.filter(row => {
    const messageDate = dayjs(row.date);
    const isWithinDateRange = (!startDate || messageDate.isAfter(startDate)) && messageDate.isBefore(endDate);
    const matchesSearchText = row.text.text.toLowerCase().includes(searchText.toLowerCase());
    return isWithinDateRange && matchesSearchText;
  });
  
  
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{width: {md: '100%', xs: '400px'} }}>
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '16px', gap: '10px'}}>
        <Button 
          variant="contained"
          size="small"
          onClick={() => downloadXlsx(filteredRows)}
        >
          Download report
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setStartDate(null);
            setEndDate(dayjs());
            setSearchText('');
          }}
        >
          Reset
        </Button>
        <CustomDateTimePicker 
          label="Start date"
          value={startDate}
          onChange={(value) => setStartDate(value || null)}
          noTime={true}
        />
        <CustomDateTimePicker 
          label="End date"
          value={endDate}
          onChange={(value) => value && setEndDate(value)}
          noTime={true}
        />
        <TextField
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          variant="standard"
          size="small"
          sx={{  marginRight: '10px' }}
        />
      </div>
      <DataGrid
        className="message-grid"
        sx={{ overflowY: 'auto', overflowX: 'auto' }}
        disableColumnFilter
        disableColumnMenu
        rows={filteredRows}
        columns={columns}
        sortingOrder={['desc', 'asc']}
        initialState={{
          pagination: {
          paginationModel: {
            pageSize: 15,
          },
          },
          sorting: {
            sortModel: [
              { field: 'date', sort: 'desc' }
            ],
          },
        }}
        pageSizeOptions={[15]}
      />
    </Box>
  )

}