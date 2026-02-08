.PHONY: backend frontend dev

backend:
	cd backend && uv run uvicorn main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

dev:
	@make -j 2 backend frontend
