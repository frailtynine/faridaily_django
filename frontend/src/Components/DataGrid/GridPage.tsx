import MainDataGrid from "./DataGrid";
import DraftGrid from "./DraftGrid";
import ChartData from "./ChartData";
import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { ChannelResponse, DraftResponse, MessageResponse } from "../../interface";
import { fetchModels, refreshTgData } from "../../api";


export default function GridPage() {
  const [channelData, setChannelData] = useState<ChannelResponse>();
  const [drafts, setDrafts] = useState<DraftResponse[]>([]);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    const fetchData = async () => {
      fetchModels('drafts/')
      .then((drafts: DraftResponse[]) => {
        setDrafts(drafts);
      })
      .catch((error) => {
        console.error(error);
      })

      fetchModels('tg/messages')
      .then((messages: MessageResponse[]) => {
        setMessages(messages);
      })
      .catch((error) => {
        console.error(error);
      })

      fetchModels('tg/get_channel_data')
      .then(fetchedData => {
        setChannelData(fetchedData);
      }).catch(error => {
        console.error('Error fetching data:', error);
      });

      refreshTgData()
      .catch(error => {
        console.error(error);
      })
    }

    fetchData()
    .then(() => {
      setLoading(false)
    })
    .catch((error) => {
      console.error(error);
    })
    
  },[])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '40px'}}>
      <Box sx={{ display: 'flex',  flexDirection: { xs: 'column', md: 'row' }, gap: '40px', marginBottom: '40px' }}>
        {drafts && channelData && <DraftGrid drafts={drafts}/>}
        {channelData && <ChartData channel={channelData}/>}
      </Box>
      {channelData && messages  && <MainDataGrid channelCount={channelData.followers} messages={messages}/>}
    </Box>
  )
}