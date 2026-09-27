import { useCallback, useEffect, useState } from 'react';
import {
  analyzeActivePage,
  type AnalyzeResult,
  type AnalyzeStep,
} from '../features/analyze/analyze-page';

export type AnalyzeState =
  | { status: 'loading'; step: AnalyzeStep }
  | { status: 'success'; result: AnalyzeResult }
  | { status: 'error'; error: unknown };

const INITIAL_STATE: AnalyzeState = { status: 'loading', step: 'capturing' };

/** Runs the analysis as soon as the component mounts, and again on every `rerun()`. */
export function useAnalyzeActivePage() {
  const [runCount, setRunCount] = useState(0);
  const [state, setState] = useState<AnalyzeState>(INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();
    const setStateIfActive = (nextState: AnalyzeState) => {
      if (!controller.signal.aborted) setState(nextState);
    };

    setState(INITIAL_STATE);
    analyzeActivePage({
      signal: controller.signal,
      onStep: (step) => setStateIfActive({ status: 'loading', step }),
    })
      .then((result) => setStateIfActive({ status: 'success', result }))
      .catch((error: unknown) => setStateIfActive({ status: 'error', error }));

    return () => controller.abort();
  }, [runCount]);

  const rerun = useCallback(() => setRunCount((count) => count + 1), []);

  return { state, rerun };
}
