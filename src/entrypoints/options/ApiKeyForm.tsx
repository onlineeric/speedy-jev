import { useState, type FormEvent } from 'react';
import { useSaveStatus } from '../../hooks/use-save-status';

interface ApiKeyFormProps {
  initialApiKey: string;
  onSave: (apiKey: string) => Promise<void>;
}

export function ApiKeyForm({ initialApiKey, onSave }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isVisible, setIsVisible] = useState(false);
  const { isSaved, markSaved, markDirty } = useSaveStatus();

  const saveApiKey = async (newApiKey: string) => {
    await onSave(newApiKey);
    setApiKey(newApiKey);
    markSaved();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void saveApiKey(apiKey.trim());
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Jev API key</h2>
      <p className="muted">
        Stored only in this browser&apos;s extension storage and sent only to api.typesafe.ai.
      </p>
      <div className="settings-form__row">
        <input
          type={isVisible ? 'text' : 'password'}
          aria-label="Jev API key"
          autoComplete="off"
          spellCheck={false}
          value={apiKey}
          onChange={(event) => {
            setApiKey(event.target.value);
            markDirty();
          }}
        />
        <button type="button" onClick={() => setIsVisible((visible) => !visible)}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="settings-form__row">
        <button type="submit" className="primary">
          Save key
        </button>
        <button type="button" onClick={() => void saveApiKey('')} disabled={!apiKey}>
          Remove key
        </button>
        {isSaved && <span className="success-text">Saved.</span>}
      </div>
    </form>
  );
}
