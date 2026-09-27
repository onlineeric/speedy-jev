import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DEFAULT_REQUEST_TEMPLATE } from '../../features/request-template/default-request-template';
import {
  apiKeySetting,
  inputPriceSetting,
  requestTemplateSetting,
} from '../../features/settings/settings-storage';
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

    const templateForm = textarea.closest('form')!;
    await userEvent.click(within(templateForm).getByRole('button', { name: 'Reset to default' }));

    expect(textarea).toHaveValue(DEFAULT_REQUEST_TEMPLATE);
  });

  it('saves a new input price', async () => {
    render(<App />);
    const input = await screen.findByLabelText('Input price in USD per million tokens');
    expect(input).toHaveValue(0.042);

    await userEvent.clear(input);
    await userEvent.type(input, '0.05');
    await userEvent.click(screen.getByRole('button', { name: 'Save price' }));

    await screen.findByText('Saved.');
    await expect(inputPriceSetting.getValue()).resolves.toBe(0.05);
  });

  it('blocks saving an empty input price', async () => {
    render(<App />);
    const input = await screen.findByLabelText('Input price in USD per million tokens');

    await userEvent.clear(input);

    expect(screen.getByText('Enter a price of 0 or more.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save price' })).toBeDisabled();
  });

  it('resets the input price field to the default', async () => {
    await inputPriceSetting.setValue(1);
    render(<App />);
    const input = await screen.findByLabelText('Input price in USD per million tokens');

    const priceForm = input.closest('form')!;
    await userEvent.click(within(priceForm).getByRole('button', { name: 'Reset to default' }));

    expect(input).toHaveValue(0.042);
  });
});
