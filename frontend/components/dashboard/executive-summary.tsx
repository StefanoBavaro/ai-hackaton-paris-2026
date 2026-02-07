import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutiveSummaryProps {
    content: string;
}

export function ExecutiveSummary({ content }: ExecutiveSummaryProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                    {content}
                </p>
            </CardContent>
        </Card>
    );
}
