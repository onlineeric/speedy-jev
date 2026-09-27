import type { ChoiceAnswer, JevAnswer, NoulAnswer, ScoreAnswer } from './jev-types';

export function formatPercent(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/** Turns a single typed Jev answer into a short human-readable summary. */
export function formatAnswer(answer: JevAnswer): string {
  switch (answer.type) {
    case 'noul':
      return formatNoul(answer);
    case 'choice':
      return formatChoice(answer);
    case 'score':
      return formatScore(answer);
    default:
      // Unknown answer types from newer API versions are shown as-is.
      return JSON.stringify(answer);
  }
}

function formatNoul({ noul }: NoulAnswer): string {
  const verdict = noul >= 0.5 ? 'Yes' : 'No';
  return `${verdict} (${formatPercent(noul)} yes)`;
}

function formatChoice({ choice, confidence }: ChoiceAnswer): string {
  return `${choice} (${formatPercent(confidence)} confidence)`;
}

function formatScore({ score, legend, confidence }: ScoreAnswer): string {
  const nearestLevel = Math.round(score);
  const label = (legend as Record<number, string | undefined>)[nearestLevel];
  const labelPrefix = label === undefined ? '' : `${label} · `;
  return `${labelPrefix}score ${score.toFixed(2)} (${formatPercent(confidence)} confidence)`;
}
