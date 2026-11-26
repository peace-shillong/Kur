/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_DEV_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

