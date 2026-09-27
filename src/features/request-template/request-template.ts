import { TEXT_PLACEHOLDER } from './text-placeholder';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

export class InvalidTemplateError extends Error {
  constructor(reason: string) {
    super(`Request template is invalid: ${reason}`);
    this.name = 'InvalidTemplateError';
  }
}

export type TemplateValidationResult = { valid: true } | { valid: false; reason: string };

export function validateRequestTemplate(template: string): TemplateValidationResult {
  try {
    parseTemplate(template);
    return { valid: true };
  } catch (error) {
    if (error instanceof InvalidTemplateError) {
      return { valid: false, reason: error.message };
    }
    throw error;
  }
}

/**
 * Builds the request body by replacing every {{text}} placeholder inside the
 * template's string values with the captured text.
 *
 * Substitution happens on the parsed JSON (not the raw string), so quotes,
 * newlines and other special characters in the text never break the JSON.
 */
export function fillRequestTemplate(template: string, text: string): JsonObject {
  return replacePlaceholder(parseTemplate(template), text) as JsonObject;
}

function parseTemplate(template: string): JsonObject {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(template) as JsonValue;
  } catch (error) {
    throw new InvalidTemplateError(`not valid JSON (${(error as Error).message}).`);
  }

  if (!isJsonObject(parsed)) {
    throw new InvalidTemplateError('the top level must be a JSON object.');
  }
  if (!containsPlaceholder(parsed)) {
    throw new InvalidTemplateError(`it must contain ${TEXT_PLACEHOLDER} inside a string value.`);
  }
  return parsed;
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function containsPlaceholder(value: JsonValue): boolean {
  if (typeof value === 'string') return value.includes(TEXT_PLACEHOLDER);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (isJsonObject(value)) return Object.values(value).some(containsPlaceholder);
  return false;
}

function replacePlaceholder(value: JsonValue, text: string): JsonValue {
  // A replacer function inserts the text literally; a replacement string would
  // interpret patterns such as `$&` found in the page text.
  if (typeof value === 'string') return value.replaceAll(TEXT_PLACEHOLDER, () => text);
  if (Array.isArray(value)) return value.map((item) => replacePlaceholder(item, text));
  if (isJsonObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replacePlaceholder(item, text)]),
    );
  }
  return value;
}
