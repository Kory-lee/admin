import { GlobalConfig, GlobalEnvConfig, ProjectConfig } from '/@/types/config';
import { getGlobalEnvConfig, isDevMode } from '/@/utils/env';
import getProjectSetting from '/@/settings/projectSetting';

export const ENV = isDevMode() ? getGlobalEnvConfig() : ((window as unknown) as GlobalEnvConfig);

const {
  VITE_GLOBAL_APP_TITLE,
  VITE_GLOBAL_API_URL,
  VITE_GLOBAL_APP_SHORT_NAME,
  VITE_GLOBAL_API_PREFIX_URL,
  VITE_GLOBAL_UPLOAD_URL,
} = ENV;

export const useGlobalSetting = (): Readonly<GlobalConfig> => {
  return {
    title: VITE_GLOBAL_APP_TITLE,
    apiUrl: VITE_GLOBAL_API_URL,
    shortName: VITE_GLOBAL_APP_SHORT_NAME,
    prefixUrl: VITE_GLOBAL_API_PREFIX_URL,
    uploadUrl: VITE_GLOBAL_UPLOAD_URL,
  };
};

export const useProjectSetting = (): ProjectConfig => {
  // TODO computed
  return getProjectSetting;
};