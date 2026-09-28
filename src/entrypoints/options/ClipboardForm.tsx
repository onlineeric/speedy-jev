import { useState } from 'react';
import { useSaveStatus } from '../../hooks/use-save-status';

interface ClipboardFormProps {
  initialCopyCapturedText: boolean;
  onSave: (copyCapturedText: boolean) => Promise<void>;
}

export function ClipboardForm({ initialCopyCapturedText, onSave }: ClipboardFormProps) {
  const [copyCapturedText, setCopyCapturedText] = useState(initialCopyCapturedText);
  const { isSaved, markSaved, markDirty } = useSaveStatus();

  // A checkbox has no draft state worth keeping, so each change is saved right away.
  const updateCopyCapturedText = (newCopyCapturedText: boolean) => {
    setCopyCapturedText(newCopyCapturedText);
    markDirty();
    void onSave(newCopyCapturedText).then(markSaved);
  };

  return (
    <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
      <h2>Clipboard</h2>
      <div className="settings-form__row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={copyCapturedText}
            onChange={(event) => updateCopyCapturedText(event.target.checked)}
          />
          Copy captured text to the clipboard
        </label>
        {isSaved && <span className="success-text">Saved.</span>}
      </div>
      <p className="muted">
        Copies the text sent to Jev (the selected text, or the whole page text when nothing is
        selected) every time the popup runs.
      </p>
    </form>
  );
}
