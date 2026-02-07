update # FinanceFlip Backend Documentation

This document provides a technical overview of the backend implementation for the FinanceFlip project.

## Architecture Overview

The backend is built using **FastAPI** (Python), chosen for its performance, type safety (Pydantic), and ease of integration with modern AI SDKs and data tools.

### Key Components

1.  **API Layer (`backend/main.py`)**:
    -   Handles CORS for the Next.js frontend.
    -   Exposes a `/api/query` endpoint that orchestrates the LLM processing and data retrieval.
    -   Includes a `/health` check for monitoring.

2.  **LLM Service (`backend/llm.py`)**:
    -   Integrates with **Anthropic Claude 4.5** via the official SDK.
    -   Translates natural language user queries into:
        -   **Financial Intent**: Categorization of the request.
        -   **SQL Queries**: Optimized DuckDB queries.
        -   **Dashboard Specifications**: UI block definitions (KPIs, Charts, Timelines).
        -   **Chaos Mode State**: UI-altering effects based on user commands.

3.  **Data Layer (`backend/db.py`)**:
    -   Uses **DuckDB** for high-performance analytical processing.
    -   Persists data in a local `finance.db` file at the root.
    -   Handles concurrent read access from the API.

## Data Schema

We use a persistent DuckDB schema synchronized with real financial data fixtures.

| Table | Description | Key Fields |
| :--- | :--- | :--- |
| `stock_prices` | OHLCV data | `ticker`, `date`, `open`, `high`, `low`, `close`, `volume` |
| `financial_metrics` | Quarterly/Annual Ratios | `ticker`, `report_period`, `market_cap`, `pe_ratio`, `revenue_growth` |
| `news` | News sentiment data | `ticker`, `date`, `title`, `sentiment` (score -1 to 1) |

## Implementation Progress

- [x] **FastAPI Migration**: Completely replaced the original Node.js backend.
- [x] **DuckDB Persistence**: Moved from in-memory/mocked data to a persistent `.db` file.
- [x] **Real Data Sync**: Implemented `backend/scripts/sync_data.py` which pulls real fixtures (AAPL, MSFT, TSLA) from established financial repositories.
- [x] **Makefile Automation**: Integrated backend installation, running, and data synchronization into a central `Makefile`.
- [x] **Environment Management**: Fully managed via `uv` for reproducible Python environments.

## Data Synchronization

The backend includes a specialized script to pull data from real sources.

**Command**: `make sync`
**Logic**: 
- Fetches raw JSON fixtures from GitHub.
- Parses nested data structures.
- Performs field mapping (e.g., mapping `price_to_earnings_ratio` from source to `pe_ratio` in DB).
- Bulk inserts into DuckDB.
