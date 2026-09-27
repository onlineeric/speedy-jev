import { useCallback, useEffect, useState } from 'react';
import type { WxtStorageItem } from 'wxt/utils/storage';

/**
 * Reads a storage item, keeps it in sync with changes and exposes a save function.
 * `value` is undefined until the first read completes.
 */
export function useStoredSetting<T>(item: WxtStorageItem<T, Record<string, unknown>>) {
  const [value, setValue] = useState<T>();

  useEffect(() => {
    let isActive = true;
    void item.getValue().then((storedValue) => {
      if (isActive) setValue(storedValue);
    });
    const unwatch = item.watch((newValue) => setValue(newValue));
    return () => {
      isActive = false;
      unwatch();
    };
  }, [item]);

  const save = useCallback((newValue: T) => item.setValue(newValue), [item]);

  return { value, save };
}
