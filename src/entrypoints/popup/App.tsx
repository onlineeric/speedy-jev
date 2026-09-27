import iconUrl from '../../../resources/speedy-jev-icon.svg';
import { useAnalyzeActivePage } from '../../hooks/use-analyze-active-page';
import { AnalyzeErrorView } from './AnalyzeErrorView';
import { AnalyzeResultView } from './AnalyzeResultView';
import { openSettingsAndClosePopup } from './open-settings';

const LOADING_MESSAGES = {
  capturing: 'Reading page…',
  sending: 'Asking Jev…',
} as const;

export function App() {
  const { state, rerun } = useAnalyzeActivePage();

  return (
    <main className="popup">
      <header className="popup__header">
        <h1 className="popup__title">
          {/* The vector source stays sharp at any size and screen density. */}
          <img src={iconUrl} alt="" width={32} height={32} />
          Speedy Jev
        </h1>
        <button type="button" onClick={rerun} disabled={state.status === 'loading'}>
          Run again
        </button>
        <button type="button" onClick={() => void openSettingsAndClosePopup()}>
          Settings
        </button>
      </header>

      {state.status === 'loading' && (
        <p className="muted" role="status">
          {LOADING_MESSAGES[state.step]}
        </p>
      )}
      {state.status === 'success' && <AnalyzeResultView result={state.result} />}
      {state.status === 'error' && <AnalyzeErrorView error={state.error} onRetry={rerun} />}
    </main>
  );
}
