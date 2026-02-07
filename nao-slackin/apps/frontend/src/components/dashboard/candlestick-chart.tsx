import { CartesianGrid, ComposedChart, Customized, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CandlestickData {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
}

interface CandlestickChartProps {
	ticker: string;
	data: CandlestickData[];
}

export function CandlestickChart({ ticker, data }: CandlestickChartProps) {
	const chartData: CandlestickData[] = data
		.map((d) => ({
			date: String((d as CandlestickData).date ?? ''),
			open: Number((d as CandlestickData).open),
			high: Number((d as CandlestickData).high),
			low: Number((d as CandlestickData).low),
			close: Number((d as CandlestickData).close),
		}))
		.filter((d) => Number.isFinite(d.open) && Number.isFinite(d.high) && Number.isFinite(d.low) && Number.isFinite(d.close));

	return (
		<Card className='col-span-full h-[450px]'>
			<CardHeader>
				<CardTitle className='text-lg font-medium'>{ticker} - Candlestick Chart</CardTitle>
			</CardHeader>
			<CardContent className='h-[350px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<ComposedChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
						<XAxis dataKey='date' axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
						<YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
						<Tooltip />
						<Customized component={<Candles />} />
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}

function Candles({ xAxisMap, yAxisMap, data }: any) {
	if (!data || data.length === 0) return null;
	const xAxis = Object.values(xAxisMap ?? {})[0] as any;
	const yAxis = Object.values(yAxisMap ?? {})[0] as any;
	if (!xAxis || !yAxis) return null;

	const bandwidth = typeof xAxis.bandwidth === 'function' ? xAxis.bandwidth() : 0;
	const candleWidth = Math.max(4, Math.min(12, bandwidth ? bandwidth * 0.6 : 8));

	return (
		<g>
			{data.map((d: CandlestickData, i: number) => {
				const x = xAxis.scale(d.date);
				if (typeof x !== 'number') return null;
				const cx = x + (bandwidth ? bandwidth / 2 : 0);
				const open = yAxis.scale(d.open);
				const close = yAxis.scale(d.close);
				const high = yAxis.scale(d.high);
				const low = yAxis.scale(d.low);
				const isUp = d.close >= d.open;
				const color = isUp ? '#10b981' : '#ef4444';
				const y = Math.min(open, close);
				const height = Math.max(1, Math.abs(open - close));

				return (
					<g key={`candle-${i}`}>
						<line x1={cx} x2={cx} y1={high} y2={low} stroke={color} strokeWidth={1} />
						<rect
							x={cx - candleWidth / 2}
							y={y}
							width={candleWidth}
							height={height}
							fill={color}
							rx={1}
						/>
					</g>
				);
			})}
		</g>
	);
}
