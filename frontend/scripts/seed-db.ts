import { Database } from 'duckdb';
import { promisify } from 'util';

const db = new Database('finance.db');
const run = promisify(db.all.bind(db));

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Create tables
        await run(`DROP TABLE IF EXISTS stock_prices`);
        await run(`
      CREATE TABLE IF NOT EXISTS stock_prices (
          ticker VARCHAR,
          date DATE,
          open DECIMAL(10,2),
          high DECIMAL(10,2),
          low DECIMAL(10,2),
          close DECIMAL(10,2),
          volume BIGINT,
          PRIMARY KEY (ticker, date)
      );
    `);

        await run(`DROP TABLE IF EXISTS journal_entries`);
        await run(`
      CREATE TABLE IF NOT EXISTS journal_entries (
          entry_id VARCHAR PRIMARY KEY,
          ticker VARCHAR,
          date DATE,
          entry_type VARCHAR, -- earnings, acquisition, scandal, product_launch, regulatory
          title VARCHAR,
          summary TEXT,
          sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
          price_impact_pct DECIMAL(5,2),
          metadata JSON
      );
    `);

        await run(`DROP TABLE IF EXISTS portfolio_holdings`);
        await run(`
      CREATE TABLE IF NOT EXISTS portfolio_holdings (
          ticker VARCHAR,
          shares INTEGER,
          cost_basis DECIMAL(10,2),
          purchase_date DATE
      );
    `);

        const tickers = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'META', 'AMZN', 'SPY'];
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');

        console.log('📈 Generating stock prices...');
        for (const ticker of tickers) {
            let currentPrice = ticker === 'SPY' ? 470 : Math.random() * 500 + 100;
            const days = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip weekends

                const volatility = ticker === 'SPY' ? 0.01 : 0.02;
                const change = currentPrice * (Math.random() - 0.5) * volatility;
                const open = currentPrice;
                const close = open + change;
                const high = Math.max(open, close) + Math.random() * 2;
                const low = Math.min(open, close) - Math.random() * 2;
                const volume = Math.floor(Math.random() * 10000000) + 1000000;

                days.push({
                    ticker,
                    date: d.toISOString().split('T')[0],
                    open,
                    high,
                    low,
                    close,
                    volume
                });
                currentPrice = close;
            }

            // Batch insert prices
            const values = days.map(d => `('${d.ticker}', '${d.date}', ${d.open}, ${d.high}, ${d.low}, ${d.close}, ${d.volume})`).join(',');
            await run(`INSERT INTO stock_prices VALUES ${values}`);
        }

        console.log('📰 Generating journal entries...');
        const eventTypes = ['earnings', 'acquisition', 'product_launch', 'regulatory'];
        const entries = [];
        for (let i = 0; i < 100; i++) {
            const ticker = tickers[Math.floor(Math.random() * (tickers.length - 1))]; // Not SPY for most events
            const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())).toISOString().split('T')[0];
            const sentiment = Math.random() * 2 - 1;

            entries.push({
                id: `entry_${i}`,
                ticker,
                date,
                type,
                title: `${ticker} ${type.replace('_', ' ')} Event`,
                summary: `Summary of the ${type} for ${ticker} on ${date}. Sentiment score: ${sentiment.toFixed(2)}.`,
                sentiment,
                impact: (sentiment * 5 * Math.random()).toFixed(2)
            });
        }
        const entryValues = entries.map(e => `('${e.id}', '${e.ticker}', '${e.date}', '${e.type}', '${e.title}', '${e.summary.replace(/'/g, "''")}', ${e.sentiment}, ${e.impact}, '{}')`).join(',');
        await run(`INSERT INTO journal_entries VALUES ${entryValues}`);

        console.log('💼 Generating portfolio holdings...');
        const portfolio = [
            { ticker: 'AAPL', shares: 50, basis: 180, date: '2023-05-10' },
            { ticker: 'MSFT', shares: 20, basis: 350, date: '2023-08-15' },
            { ticker: 'NVDA', shares: 10, basis: 400, date: '2023-11-20' },
        ];
        const portfolioValues = portfolio.map(p => `('${p.ticker}', ${p.shares}, ${p.basis}, '${p.date}')`).join(',');
        await run(`INSERT INTO portfolio_holdings VALUES ${portfolioValues}`);

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        db.close();
    }
}

seed();
