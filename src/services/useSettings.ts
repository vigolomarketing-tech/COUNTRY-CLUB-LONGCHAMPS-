import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings } from './settings';
export const useSettings = () => useSyncExternalStore(subscribeSettings, getSettings);
