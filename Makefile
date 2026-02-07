.PHONY: install backend frontend dev

# Installation
install:
	@echo "Installing backend dependencies with uv..."
	cd backend && uv sync
	@echo "Installing frontend dependencies with npm..."
	cd frontend && npm install

# Run Backend
backend:
	@echo "Starting FastAPI backend..."
	cd backend && uv run uvicorn main:app --reload --port 8000

# Run Frontend
frontend:
	@echo "Starting Next.js frontend..."
	cd frontend && npm run dev

# Run Both Concurrently
dev:
	@make -j 2 backend frontend

# Sync Real Data
# Usage: make sync TICKERS="AAPL MSFT" SUFFIX="_2024-03-01_2024-03-08"
TICKERS ?= "AAPL MSFT TSLA"
SUFFIX ?= "_2024-03-01_2024-03-08"

sync:
	@echo "Synchronizing real financial data for $(TICKERS)..."
	uv run --project backend python3 backend/scripts/sync_data.py --tickers $(TICKERS) --suffix $(SUFFIX)
