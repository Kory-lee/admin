import type { GlobalEnvConfig } from '/@/types/config';
// ImportMeta
export const getGlobalEnvConfig = (): GlobalEnvConfig => {
  const env = import.meta.env;
  return (env as unknown) as GlobalEnvConfig;
};
export const devMode = 'development';

export const prodMode = 'production';

export const isUseMock = (): boolean => import.meta.env.VITE_USE_MOCK === 'true';

export const isDevMode = (): boolean => import.meta.env.DEV;

export const isProdMode = (): boolean => import.meta.env.PROD;
