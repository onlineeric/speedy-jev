import { formatAnswer } from '../features/jev-api/format-answer';
import type { JevAnswer } from '../features/jev-api/jev-types';
import './AnswerList.css';

interface AnswerListProps {
  answers: Record<string, JevAnswer>;
}

export function AnswerList({ answers }: AnswerListProps) {
  const entries = Object.entries(answers);
  if (entries.length === 0) {
    return <p className="muted">Jev returned no answers.</p>;
  }

  return (
    <dl className="answer-list">
      {entries.map(([questionId, answer]) => (
        <div key={questionId} className="answer-list__row">
          <dt>{questionId}</dt>
          <dd>{formatAnswer(answer)}</dd>
        </div>
      ))}
    </dl>
  );
}
