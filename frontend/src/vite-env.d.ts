/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_USER_SERVICE_URL?: string;
  readonly VITE_DEFAULT_TOUR_IMAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
