// Named import so the bundler inlines only the version string, not the whole package.json.
import { version } from '../../../package.json';
import { AnswerList } from '../../components/AnswerList';
import type { AnalyzeResult } from '../../features/analyze/analyze-page';
import { UsageSummary } from './UsageSummary';

const SOURCE_LABELS = {
  selection: 'Selected text',
  page: 'Whole page',
} as const;

interface AnalyzeResultViewProps {
  result: AnalyzeResult;
}

export function AnalyzeResultView({
  result: { captured, response, copiedToClipboard },
}: AnalyzeResultViewProps) {
  return (
    <section className="popup__section" aria-label="Jev response">
      <p className="muted">
        {SOURCE_LABELS[captured.source]} · {captured.text.length.toLocaleString()} characters
        {copiedToClipboard && ' · Copied to clipboard'}
      </p>

      <AnswerList answers={response.answers ?? {}} />

      <div className="popup__meta muted">
        <p>Model {response.model}</p>
        {response.usage && <UsageSummary usage={response.usage} />}
        <p>Version {version}</p>
      </div>

      <details>
        <summary>Captured text</summary>
        <pre className="popup__scroll-box">{captured.text}</pre>
      </details>

      <details>
        <summary>Raw response</summary>
        <pre className="popup__scroll-box">{JSON.stringify(response, null, 2)}</pre>
      </details>
    </section>
  );
}
