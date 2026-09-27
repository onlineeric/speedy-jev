import { describe, expect, it } from 'vitest';
import { formatAnswer, formatPercent } from './format-answer';
import type { JevAnswer } from './jev-types';

describe('formatPercent', () => {
  it('rounds to a whole percentage', () => {
    expect(formatPercent(0.876)).toBe('88%');
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(1)).toBe('100%');
  });
});

describe('formatAnswer', () => {
  it('formats a likely-yes noul answer', () => {
    expect(formatAnswer({ type: 'noul', noul: 0.95 })).toBe('Yes (95% yes)');
  });

  it('formats a likely-no noul answer', () => {
    expect(formatAnswer({ type: 'noul', noul: 0.08 })).toBe('No (8% yes)');
  });

  it('formats a choice answer', () => {
    const answer: JevAnswer = {
      type: 'choice',
      choice: 'billing',
      probabilities: { billing: 0.88, technical: 0.12 },
      confidence: 0.81,
    };
    expect(formatAnswer(answer)).toBe('billing (81% confidence)');
  });

  it('formats a score answer with an object legend', () => {
    const answer: JevAnswer = {
      type: 'score',
      score: 1.05,
      legend: { '0': 'Calm', '1': 'Frustrated', '2': 'Very angry' },
      probabilities: { '0': 0, '1': 0.95, '2': 0.05 },
      confidence: 0.92,
    };
    expect(formatAnswer(answer)).toBe('Frustrated · score 1.05 (92% confidence)');
  });

  it('formats a score answer with an array legend', () => {
    const answer: JevAnswer = {
      type: 'score',
      score: 1.6,
      legend: ['Low', 'Medium', 'High'],
      probabilities: [0.1, 0.2, 0.7],
      confidence: 0.5,
    };
    expect(formatAnswer(answer)).toBe('High · score 1.60 (50% confidence)');
  });

  it('omits the label when the legend has no matching level', () => {
    const answer: JevAnswer = {
      type: 'score',
      score: 7,
      legend: ['Low', 'High'],
      probabilities: [0.5, 0.5],
      confidence: 0.3,
    };
    expect(formatAnswer(answer)).toBe('score 7.00 (30% confidence)');
  });

  it('shows unknown answer types as JSON', () => {
    const answer = { type: 'future', value: 1 } as unknown as JevAnswer;
    expect(formatAnswer(answer)).toBe('{"type":"future","value":1}');
  });
});
