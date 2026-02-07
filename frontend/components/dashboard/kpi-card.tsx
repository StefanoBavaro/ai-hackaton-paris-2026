import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
    ticker: string;
    metric: string;
    value: string;
    change: string;
    changeDirection: 'up' | 'down';
    comparisonBenchmark?: string;
}

export function KPICard({ ticker, metric, value, change, changeDirection, comparisonBenchmark }: KPICardProps) {
    const isUp = changeDirection === 'up';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {ticker} - {metric}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className={cn(
                    "flex items-center text-xs",
                    isUp ? "text-green-600" : "text-red-600"
                )}>
                    {isUp ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
                    {change}
                </div>
                {comparisonBenchmark && (
                    <p className="text-xs text-muted-foreground mt-1">
                        vs {comparisonBenchmark}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
