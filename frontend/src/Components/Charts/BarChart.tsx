import { BarChart } from '@mui/x-charts';

interface BarChartProps {
  xAxis: number[];
  yAxis: number[]
  width: number;
  height: number;
}

export default function CustomBarChart({xAxis, yAxis, width, height}: BarChartProps) {

  return (
    <div>
      <BarChart
        xAxis={[{ 
          scaleType: 'band',
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