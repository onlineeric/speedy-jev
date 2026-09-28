import { useStoredSetting } from '../../hooks/use-stored-setting';
import {
  apiKeySetting,
  copyCapturedTextSetting,
  inputPriceSetting,
  requestTemplateSetting,
} from '../../features/settings/settings-storage';
import { ApiKeyForm } from './ApiKeyForm';
import { ClipboardForm } from './ClipboardForm';
import { InputPriceForm } from './InputPriceForm';
import { RequestTemplateForm } from './RequestTemplateForm';

export function App() {
  const apiKey = useStoredSetting(apiKeySetting);
  const requestTemplate = useStoredSetting(requestTemplateSetting);
  const inputPrice = useStoredSetting(inputPriceSetting);
  const copyCapturedText = useStoredSetting(copyCapturedTextSetting);

  return (
    <main className="options">
      <h1>Speedy Jev Settings</h1>
      {apiKey.value !== undefined && (
        <ApiKeyForm initialApiKey={apiKey.value} onSave={apiKey.save} />
      )}
      {requestTemplate.value !== undefined && (
        <RequestTemplateForm initialTemplate={requestTemplate.value} onSave={requestTemplate.save} />
      )}
      {inputPrice.value !== undefined && (
        <InputPriceForm initialPrice={inputPrice.value} onSave={inputPrice.save} />
      )}
      {copyCapturedText.value !== undefined && (
        <ClipboardForm
          initialCopyCapturedText={copyCapturedText.value}
          onSave={copyCapturedText.save}
        />
      )}
    </main>
  );
}
