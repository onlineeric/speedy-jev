import { useState, type FormEvent } from 'react';
import { useSaveStatus } from '../../hooks/use-save-status';
import { DEFAULT_REQUEST_TEMPLATE } from '../../features/request-template/default-request-template';
import { validateRequestTemplate } from '../../features/request-template/request-template';
import { TEXT_PLACEHOLDER } from '../../features/request-template/text-placeholder';

interface RequestTemplateFormProps {
  initialTemplate: string;
  onSave: (template: string) => Promise<void>;
}

export function RequestTemplateForm({ initialTemplate, onSave }: RequestTemplateFormProps) {
  const [template, setTemplate] = useState(initialTemplate);
  const { isSaved, markSaved, markDirty } = useSaveStatus();
  const validation = validateRequestTemplate(template);

  const updateTemplate = (newTemplate: string) => {
    setTemplate(newTemplate);
    markDirty();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validation.valid) return;
    void onSave(template).then(markSaved);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Request body template</h2>
      <p className="muted">
        JSON body sent to Jev. Every <code>{TEXT_PLACEHOLDER}</code> inside a string value is
        replaced with the selected text, or the whole page text when nothing is selected. See the{' '}
        <a href="https://docs.typesafe.ai/api" target="_blank" rel="noreferrer">
          Jev API docs
        </a>{' '}
        for the available question types.
      </p>
      <textarea
        className="code"
        aria-label="Request body template"
        spellCheck={false}
        value={template}
        onChange={(event) => updateTemplate(event.target.value)}
      />
      {!validation.valid && <p className="error-text">{validation.reason}</p>}
      <div className="settings-form__row">
        <button type="submit" className="primary" disabled={!validation.valid}>
          Save template
        </button>
        <button type="button" onClick={() => updateTemplate(DEFAULT_REQUEST_TEMPLATE)}>
          Reset to default
        </button>
        {isSaved && <span className="success-text">Saved.</span>}
      </div>
    </form>
  );
}
