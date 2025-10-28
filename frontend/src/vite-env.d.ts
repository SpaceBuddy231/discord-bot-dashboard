/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_DISCORD_CLIENT_ID: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_REALTIME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
