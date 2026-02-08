const DEFAULT_API_URL = 'http://localhost:8000';

export const API_URL = import.meta.env.VITE_FASTAPI_URL || DEFAULT_API_URL;

export const WS_URL = API_URL.replace(/^http/, 'ws');
