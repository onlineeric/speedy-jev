import { isFixableInSettings, toErrorMessage } from '../../features/analyze/analyze-errors';
import { JevApiError } from '../../features/jev-api/jev-api-error';
import { openSettingsAndClosePopup } from './open-settings';

interface AnalyzeErrorViewProps {
  error: unknown;
  onRetry: () => void;
}

export function AnalyzeErrorView({ error, onRetry }: AnalyzeErrorViewProps) {
  const detail = error instanceof JevApiError ? error.detail : '';

  return (
    <section className="popup__section" role="alert">
      <p className="error-text">{toErrorMessage(error)}</p>
      {detail && (
        <details>
          <summary>Details from Jev</summary>
          <pre>{detail}</pre>
        </details>
      )}
      <div className="popup__actions">
        {isFixableInSettings(error) ? (
          <button type="button" className="primary" onClick={() => void openSettingsAndClosePopup()}>
            Open settings
          </button>
        ) : (
          <button type="button" className="primary" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </section>
  );
}
