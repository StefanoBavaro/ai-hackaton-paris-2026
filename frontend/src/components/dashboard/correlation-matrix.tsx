import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CorrelationMatrixProps {
	tickers: string[];
	data: number[][];
	period: string;
}

export function CorrelationMatrix({ tickers, data, period }: CorrelationMatrixProps) {
	const getColor = (value: number) => {
		const alpha = Math.abs(value);
		if (value > 0) return `rgba(16, 185, 129, ${alpha})`;
		return `rgba(239, 68, 68, ${alpha})`;
	};

	return (
		<Card className='col-span-full'>
			<CardHeader>
				<CardTitle className='text-lg font-medium'>Correlation Matrix - {period}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr>
								<th className='p-2 border bg-muted/50' />
								{tickers.map((ticker) => (
									<th key={ticker} className='p-2 border bg-muted/50 text-xs font-semibold'>
										{ticker}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{tickers.map((rowTicker, i) => (
								<tr key={rowTicker}>
									<td className='p-2 border bg-muted/50 text-xs font-semibold'>{rowTicker}</td>
									{data[i]?.map((value, j) => (
										<td
											key={`${i}-${j}`}
											className='p-2 border text-center text-xs font-mono'
											style={{
												backgroundColor: getColor(value),
												color: Math.abs(value) > 0.5 ? 'white' : 'inherit',
											}}
										>
											{Number.isFinite(value) ? value.toFixed(2) : '—'}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
