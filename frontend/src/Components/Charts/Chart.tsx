import { LineChart } from '@mui/x-charts/LineChart';

interface LineChartProps {
  xAxis: number[];
  yAxis: number[]
  width: number;
  height: number;
}

export default function LineChartComponent({xAxis, yAxis, width, height}: LineChartProps) {

  return (
    <div>
      <LineChart
        xAxis={[{ 
          data: xAxis,
          valueFormatter: (value) => new Date(value).toLocaleDateString() 
        }]}
        series={[{data: yAxis}]}
        width={width}
        height={height}
      />
    </div>
  )
}