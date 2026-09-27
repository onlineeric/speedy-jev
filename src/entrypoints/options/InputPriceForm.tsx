import { useState, type FormEvent } from 'react';
import { DEFAULT_INPUT_PRICE_PER_MTOK, isValidPrice } from '../../features/pricing/request-cost';
import { useSaveStatus } from '../../hooks/use-save-status';

interface InputPriceFormProps {
  initialPrice: number;
  onSave: (price: number) => Promise<void>;
}

export function InputPriceForm({ initialPrice, onSave }: InputPriceFormProps) {
  const [priceText, setPriceText] = useState(String(initialPrice));
  const { isSaved, markSaved, markDirty } = useSaveStatus();
  const price = Number(priceText);
  const isValid = priceText.trim() !== '' && isValidPrice(price);

  const updatePriceText = (newPriceText: string) => {
    setPriceText(newPriceText);
    markDirty();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    void onSave(price).then(markSaved);
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Input price</h2>
      <p className="muted">
        USD per million input tokens, used to estimate the cost of each request (output tokens are
        free). TypeSafe does not publish prices through its API, so update this when the{' '}
        <a href="https://docs.typesafe.ai/models" target="_blank" rel="noreferrer">
          Jev price
        </a>{' '}
        changes.
      </p>
      <div className="settings-form__row">
        <input
          type="number"
          min="0"
          step="any"
          aria-label="Input price in USD per million tokens"
          value={priceText}
          onChange={(event) => updatePriceText(event.target.value)}
        />
      </div>
      {!isValid && <p className="error-text">Enter a price of 0 or more.</p>}
      <div className="settings-form__row">
        <button type="submit" className="primary" disabled={!isValid}>
          Save price
        </button>
        <button type="button" onClick={() => updatePriceText(String(DEFAULT_INPUT_PRICE_PER_MTOK))}>
          Reset to default
        </button>
        {isSaved && <span className="success-text">Saved.</span>}
      </div>
    </form>
  );
}
