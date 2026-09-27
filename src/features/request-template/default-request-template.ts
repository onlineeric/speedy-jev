import { TEXT_PLACEHOLDER } from './text-placeholder';

const defaultRequestBody = {
  model: 'jev-latest',
  state: TEXT_PLACEHOLDER,
  questions: {
    sentiment: {
      type: 'score',
      instructions: 'What is the overall sentiment of this text?',
      criteria: ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'],
    },
    content_type: {
      type: 'choice',
      instructions: 'What kind of content is this?',
      criteria: {
        news: 'News reporting or current events',
        opinion: 'Opinion, commentary or review',
        technical: 'Technical documentation, tutorial or code',
        marketing: 'Product page, advertising or promotional copy',
        other: 'Anything else',
      },
    },
    is_actionable: {
      type: 'noul',
      instructions: 'Does this text ask the reader to take a specific action?',
    },
  },
};

export const DEFAULT_REQUEST_TEMPLATE = JSON.stringify(defaultRequestBody, null, 2);
