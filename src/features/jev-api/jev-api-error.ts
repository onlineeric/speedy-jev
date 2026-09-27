const MAX_DETAIL_LENGTH = 500;

const MESSAGES_BY_STATUS: Record<number, string> = {
  401: 'Jev rejected the API key. Check your key in Settings.',
  422: 'Jev could not process the request body. Check your request template in Settings.',
  429: 'Jev rate limit reached. Wait a moment and try again.',
  529: 'Jev is temporarily overloaded. Try again shortly.',
};

/** An HTTP error response returned by the Jev API. */
export class JevApiError extends Error {
  readonly status: number;
  /** Response body text from Jev, trimmed for display. */
  readonly detail: string;

  constructor(status: number, responseBody: string) {
    super(MESSAGES_BY_STATUS[status] ?? `Jev request failed (HTTP ${status}).`);
    this.name = 'JevApiError';
    this.status = status;
    this.detail = responseBody.trim().slice(0, MAX_DETAIL_LENGTH);
  }
}

/** The request never reached Jev (offline, DNS, blocked, ...). */
export class JevNetworkError extends Error {
  constructor(options?: ErrorOptions) {
    super('Could not reach Jev. Check your internet connection.', options);
    this.name = 'JevNetworkError';
  }
}
