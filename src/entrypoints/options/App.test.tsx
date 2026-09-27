import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DEFAULT_REQUEST_TEMPLATE } from '../../features/request-template/default-request-template';
import { apiKeySetting, requestTemplateSetting } from '../../features/settings/settings-storage';
import { App } from './App';

describe('options App', () => {
  it('loads the stored API key into a hidden input', async () => {
    await apiKeySetting.setValue('stored-key');
    render(<App />);

    const input = await screen.findByLabelText('Jev API key');
    expect(input).toHaveValue('stored-key');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('saves a trimmed API key', async () => {
    render(<App />);

    await userEvent.type(await screen.findByLabelText('Jev API key'), '  new-key  ');
    await userEvent.click(screen.getByRole('button', { name: 'Save key' }));

    expect(await screen.findByText('Saved.')).toBeInTheDocument();
    await expect(apiKeySetting.getValue()).resolves.toBe('new-key');
  });

  it('removes the API key', async () => {
    await apiKeySetting.setValue('stored-key');
    render(<App />);

    await screen.findByDisplayValue('stored-key');
    await userEvent.click(screen.getByRole('button', { name: 'Remove key' }));

    await screen.findByText('Saved.');
    await expect(apiKeySetting.getValue()).resolves.toBe('');
  });

  it('blocks saving an invalid template and explains why', async () => {
    render(<App />);
    const textarea = await screen.findByLabelText('Request body template');

    await userEvent.clear(textarea);
    await userEvent.type(textarea, '{{"state": "no placeholder"}');

    expect(screen.getByText(/must contain \{\{text\}\}/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save template' })).toBeDisabled();
  });

  it('saves a valid template', async () => {
    render(<App />);
    const textarea = await screen.findByLabelText('Request body template');

    await userEvent.clear(textarea);
    // In user-event's typing syntax `{{` types a literal `{`.
    await userEvent.type(textarea, '{{"state": "{{{{text}}"}');
    await userEvent.click(screen.getByRole('button', { name: 'Save template' }));

    await screen.findByText('Saved.');
    await expect(requestTemplateSetting.getValue()).resolves.toBe('{"state": "{{text}}"}');
  });

  it('resets the template editor to the default', async () => {
    await requestTemplateSetting.setValue('{"state": "{{text}}"}');
    render(<App />);
    const textarea = await screen.findByLabelText('Request body template');

    await userEvent.click(screen.getByRole('button', { name: 'Reset to default' }));

    expect(textarea).toHaveValue(DEFAULT_REQUEST_TEMPLATE);
  });
});
