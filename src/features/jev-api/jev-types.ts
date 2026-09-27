/**
 * Response types for the Jev System One API.
 * See https://docs.typesafe.ai/api
 */

export interface NoulAnswer {
  type: 'noul';
  /** Probability (0–1) that the answer is "yes". */
  noul: number;
}

export interface ChoiceAnswer {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ScoreAnswer {
  type: 'score';
  /** Probability-weighted position on the ordered scale (0-based). */
  score: number;
  /** Maps each scale level index to its label. */
  legend: Record<string, string> | string[];
  probabilities: Record<string, number> | number[];
  confidence: number;
}

export type JevAnswer = NoulAnswer | ChoiceAnswer | ScoreAnswer;

export interface JevUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface JevResponse {
  model: string;
  answers: Record<string, JevAnswer>;
  usage?: JevUsage;
}
