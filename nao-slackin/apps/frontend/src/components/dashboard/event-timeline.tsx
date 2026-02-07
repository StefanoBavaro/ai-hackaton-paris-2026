import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Event {
	date: string;
	ticker: string;
	entry_type: string;
	title: string;
	summary: string;
	sentiment_score: number;
	price_impact_pct: number;
}

interface EventTimelineProps {
	events: Event[];
}

export function EventTimeline({ events }: EventTimelineProps) {
	return (
		<Card className='col-span-full'>
			<CardHeader>
				<CardTitle className='text-lg font-medium'>Event Timeline</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-6'>
					{events.map((event, index) => (
						<div key={index} className='flex gap-4'>
							<div className='flex flex-col items-center'>
								<div className='w-2 h-2 rounded-full bg-primary mt-2' />
								{index !== events.length - 1 && <div className='w-px h-full bg-border my-2' />}
							</div>
							<div className='flex-1 pb-4'>
								<div className='flex items-center justify-between mb-1'>
									<span className='text-sm font-semibold'>
										{event.ticker} - {event.title}
									</span>
									<span className='text-xs text-muted-foreground'>{event.date}</span>
								</div>
								<div className='flex gap-2 mb-2'>
									<Badge variant='outline' className='capitalize'>
										{event.entry_type}
									</Badge>
									<Badge
										className={cn(
											event.sentiment_score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
											'border-none',
										)}
									>
										Sentiment: {event.sentiment_score > 0 ? '+' : ''}
										{event.sentiment_score.toFixed(2)}
									</Badge>
									<Badge variant='secondary'>Impact: {event.price_impact_pct}%</Badge>
								</div>
								<p className='text-sm text-muted-foreground leading-snug'>{event.summary}</p>
							</div>
						</div>
					))}
					{events.length === 0 && (
						<p className='text-center text-muted-foreground py-8 italic'>No significant events found.</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
