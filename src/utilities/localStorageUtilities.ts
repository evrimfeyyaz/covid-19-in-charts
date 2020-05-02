import { isCurrentVersionHigherThan } from './versionUtilities';

export function localStorageCleanup() {
  if (isCurrentVersionHigherThan('0.15.6')) {
    localStorage.removeItem('dataByLocationJson');
    localStorage.removeItem('lastUpdatedTimeStr');
    localStorage.removeItem('localDataExpirationTimeStr');
    localStorage.removeItem('version');
  }
}

export function setLocalStorageItem<T>(key: string, value: T) {
  const valueJson = JSON.stringify(value);
  localStorage.setItem(key, valueJson);
}

export function getLocalStorageItem<T>(key: string): (T | null) {
  const valueJson = localStorage.getItem(key);

  let value: (T | null) = null;
  if (valueJson) {
    try {
      value = JSON.parse(valueJson);
    } catch (error) {
      localStorage.removeItem(key);
    }
  }

  return value;
}
