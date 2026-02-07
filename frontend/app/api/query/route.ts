import { NextRequest, NextResponse } from 'next/server';
import { processQuery } from '@/lib/llm';
import { queryDb } from '@/lib/duckdb';

export async function POST(req: NextRequest) {
    try {
        const { message, currentChaos } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Process query with LLM
        const result = await processQuery(message, currentChaos);

        // 2. Execute SQL queries
        const queryResults: any[] = [];
        if (result.sqlQueries && Array.isArray(result.sqlQueries)) {
            for (const sql of result.sqlQueries) {
                try {
                    const data = await queryDb(sql);
                    queryResults.push(data);
                } catch (e) {
                    console.error(`SQL Execution Error for: ${sql}`, e);
                    queryResults.push([]);
                }
            }
        }

        // 3. Replace placeholders in dashboardSpec
        let specString = JSON.stringify(result.dashboardSpec);
        queryResults.forEach((data, index) => {
            const placeholder = `"QUERY_RESULT_${index}"`;
            specString = specString.replace(placeholder, JSON.stringify(data));
        });

        const finalSpec = JSON.parse(specString);

        return NextResponse.json({
            dashboardSpec: finalSpec,
            assistantMessage: result.assistantMessage,
            intent: result.intent
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            error: 'Failed to process query',
            message: error.message
        }, { status: 500 });
    }
}
