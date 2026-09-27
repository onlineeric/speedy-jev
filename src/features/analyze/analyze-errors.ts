import { JevApiError } from '../jev-api/jev-api-error';
import { InvalidTemplateError } from '../request-template/request-template';

export class MissingApiKeyError extends Error {
  constructor() {
    super('Add your Jev API key in Settings to get started.');
    this.name = 'MissingApiKeyError';
  }
}

const SETTINGS_RELATED_STATUSES = new Set([401, 422]);

/** True when the user can most likely fix the error on the Settings page. */
export function isFixableInSettings(error: unknown): boolean {
  if (error instanceof MissingApiKeyError || error instanceof InvalidTemplateError) return true;
  return error instanceof JevApiError && SETTINGS_RELATED_STATUSES.has(error.status);
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}
