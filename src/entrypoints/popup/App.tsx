import iconUrl from '../../../resources/speedy-jev-icon.svg';
import { useAnalyzeActivePage } from '../../hooks/use-analyze-active-page';
import { AnalyzeErrorView } from './AnalyzeErrorView';
import { AnalyzeResultView } from './AnalyzeResultView';
import { ExternalLinkIcon, GearIcon, RefreshIcon } from './icons';
import { IconButton, IconLink } from './IconControls';
import { openSettingsAndClosePopup } from './open-settings';

// A plain link: opening a tab needs no extra permission and no host access.
const CONSOLE_URL = 'https://console.typesafe.ai/home';

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
        <IconButton
          label="Run again"
          icon={<RefreshIcon />}
          onClick={rerun}
          disabled={state.status === 'loading'}
        />
        <IconButton
          label="Settings"
          icon={<GearIcon />}
          onClick={() => void openSettingsAndClosePopup()}
        />
        <IconLink label="Open Typesafe Console" icon={<ExternalLinkIcon />} href={CONSOLE_URL} />
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
