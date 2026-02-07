import {
	CartesianGrid,
	Legend,
	Line,
	LineChart as RechartsLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartProps {
	title: string;
	data: any[];
	xKey: string;
	yKeys: string[];
}

const COLORS = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#6366f1', '#8b5cf6'];

export function LineChart({ title, data, xKey, yKeys }: LineChartProps) {
	return (
		<Card className='col-span-full h-[400px]'>
			<CardHeader>
				<CardTitle className='text-lg font-medium'>{title}</CardTitle>
			</CardHeader>
			<CardContent className='h-[300px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<RechartsLineChart data={data}>
						<CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
						<XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
						<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
						<Tooltip
							contentStyle={{
								borderRadius: '8px',
								border: 'none',
								boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
							}}
						/>
						<Legend verticalAlign='top' height={36} />
						{yKeys.map((key, index) => (
							<Line
								key={key}
								type='monotone'
								dataKey={key}
								stroke={COLORS[index % COLORS.length]}
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4 }}
							/>
						))}
					</RechartsLineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
