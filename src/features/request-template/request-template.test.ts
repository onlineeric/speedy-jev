import { describe, expect, it } from 'vitest';
import { DEFAULT_REQUEST_TEMPLATE } from './default-request-template';
import {
  fillRequestTemplate,
  InvalidTemplateError,
  validateRequestTemplate,
} from './request-template';

describe('validateRequestTemplate', () => {
  it('accepts the default template', () => {
    expect(validateRequestTemplate(DEFAULT_REQUEST_TEMPLATE)).toEqual({ valid: true });
  });

  it('rejects text that is not JSON', () => {
    const result = validateRequestTemplate('{ "state": "{{text}}", }');
    expect(result.valid).toBe(false);
    expect(!result.valid && result.reason).toContain('not valid JSON');
  });

  it.each(['[]', '"{{text}}"', 'null', '42'])('rejects non-object top level: %s', (template) => {
    const result = validateRequestTemplate(template);
    expect(!result.valid && result.reason).toContain('must be a JSON object');
  });

  it('rejects a template without the {{text}} placeholder', () => {
    const result = validateRequestTemplate('{ "state": "hello" }');
    expect(!result.valid && result.reason).toContain('{{text}}');
  });

  it('does not count a placeholder used only as an object key', () => {
    const result = validateRequestTemplate('{ "{{text}}": 1 }');
    expect(result.valid).toBe(false);
  });

  it('finds the placeholder nested in arrays and objects', () => {
    const template = JSON.stringify({ a: { b: [1, { c: 'prefix {{text}}' }] } });
    expect(validateRequestTemplate(template)).toEqual({ valid: true });
  });
});

describe('fillRequestTemplate', () => {
  it('replaces a placeholder that is the whole string value', () => {
    const body = fillRequestTemplate('{ "model": "jev-latest", "state": "{{text}}" }', 'Hello');
    expect(body).toEqual({ model: 'jev-latest', state: 'Hello' });
  });

  it('replaces placeholders inside larger strings, including repeated ones', () => {
    const body = fillRequestTemplate('{ "state": "A: {{text}} / B: {{text}}" }', 'x');
    expect(body).toEqual({ state: 'A: x / B: x' });
  });

  it('replaces placeholders nested in arrays and objects', () => {
    const template = JSON.stringify({
      state: { title: '{{text}}', parts: ['{{text}}', 'static'] },
    });
    expect(fillRequestTemplate(template, 'page')).toEqual({
      state: { title: 'page', parts: ['page', 'static'] },
    });
  });

  it('keeps non-string values and object keys untouched', () => {
    const template = JSON.stringify({
      state: '{{text}}',
      count: 3,
      enabled: true,
      nothing: null,
      '{{text}}': 'key stays',
    });
    expect(fillRequestTemplate(template, 'T')).toEqual({
      state: 'T',
      count: 3,
      enabled: true,
      nothing: null,
      '{{text}}': 'key stays',
    });
  });

  it('keeps special characters in the text intact and produces valid JSON', () => {
    const trickyText = 'He said "hi"\nnew line \\ backslash {"json": true} $& $1';
    const body = fillRequestTemplate('{ "state": "{{text}}" }', trickyText);

    expect(body.state).toBe(trickyText);
    expect(JSON.parse(JSON.stringify(body))).toEqual({ state: trickyText });
  });

  it('throws InvalidTemplateError for an invalid template', () => {
    expect(() => fillRequestTemplate('not json', 'x')).toThrow(InvalidTemplateError);
  });

  it('fills the default template state with the text', () => {
    const body = fillRequestTemplate(DEFAULT_REQUEST_TEMPLATE, 'Some page');
    expect(body).toMatchObject({ model: 'jev-latest', state: 'Some page' });
  });
});
