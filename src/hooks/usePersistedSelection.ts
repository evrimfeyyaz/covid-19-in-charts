import { getLocalStorageItem, setLocalStorageItem } from "../utilities/localStorageUtilities";

type UsePersistedSelectionResult<T> = [
  T, // lastSelection
  (selection: T) => void // persistLastSelection()
];

export interface UsePersistedSelectionOptions {
  lastSelectionAsDefault?: boolean;
  lastSelectionStorageKey?: string;
}

function usePersistedSelection<T>(
  defaultSelection: T,
  options: UsePersistedSelectionOptions = {}
): UsePersistedSelectionResult<T> {
  const { lastSelectionAsDefault, lastSelectionStorageKey } = options;

  function persistLastSelection(selection: T): void {
    if (lastSelectionAsDefault && lastSelectionStorageKey) {
      setLocalStorageItem(lastSelectionStorageKey, selection);
    }
  }

  function restoreLastSelection(): T {
    let lastSelection: T | null = null;
    if (lastSelectionAsDefault && lastSelectionStorageKey) {
      lastSelection = getLocalStorageItem(lastSelectionStorageKey);
    }

    return lastSelection != null && (!Array.isArray(lastSelection) || lastSelection.length > 0)
      ? lastSelection
      : defaultSelection;
  }

  return [restoreLastSelection(), persistLastSelection];
}

export default usePersistedSelection;
