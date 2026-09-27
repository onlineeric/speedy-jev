import { useCallback, useState } from 'react';

/** Tracks whether the current form value has just been saved. */
export function useSaveStatus() {
  const [isSaved, setIsSaved] = useState(false);
  const markSaved = useCallback(() => setIsSaved(true), []);
  const markDirty = useCallback(() => setIsSaved(false), []);
  return { isSaved, markSaved, markDirty };
}
