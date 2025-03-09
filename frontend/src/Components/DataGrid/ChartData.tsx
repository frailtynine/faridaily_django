import { ChannelResponse } from "../../interface";
import CustomBarChart from "../Charts/BarChart";
import { Box, List, ListItem, Typography } from "@mui/material";

interface ChartDataProps {
  channel: ChannelResponse;
}

export default function ChartData({channel}: ChartDataProps) {
  const channelGrowth = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const closestIndex = channel.growth_graph.x_axis.reduce((prev, curr, index) => {
      return Math.abs(curr - oneWeekAgo) < Math.abs(channel.growth_graph.x_axis[prev] - oneWeekAgo) ? index : prev;
    }, 0);
    const latestIndex = channel.growth_graph.y_axis.length - 1;


    return `Weekly growth: ${channel.growth_graph.y_axis[latestIndex] - channel.growth_graph.y_axis[closestIndex]}`;

  };
  
  return (
    <Box>
      <Typography variant="h4">Faridaily Stats:</Typography>
        <List>
          <ListItem>Followers: {channel.followers}</ListItem>
          <ListItem>{channelGrowth()}</ListItem>
        </List>
      <CustomBarChart xAxis={channel.views_graph.date} yAxis={channel.views_graph.views} width={500} height={300}/>
    </Box>
  )
}