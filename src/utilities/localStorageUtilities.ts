import { isCurrentVersionHigherThan } from './versionUtilities';

export function localStorageCleanup() {
  if (isCurrentVersionHigherThan('0.15.6')) {
    localStorage.removeItem('dataByLocationJson');
    localStorage.removeItem('lastUpdatedTimeStr');
    localStorage.removeItem('localDataExpirationTimeStr');
    localStorage.removeItem('version');
  }
}
