import { Cell, Pie, PieChart, Tooltip } from 'recharts';

const ChargesChart = ({ data }: { data: any }) => {
  const COLORS = ['#38bdf8', '#86efac'];

  return (
    <PieChart className='' width={160} height={160}>
      <Pie data={data} innerRadius={40} outerRadius={70} dataKey='value'>
        {data.map((entry: any, index: number) => (
          <Cell key={entry.value} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default ChargesChart;
