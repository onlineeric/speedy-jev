import { useStoredSetting } from '../../hooks/use-stored-setting';
import { apiKeySetting, requestTemplateSetting } from '../../features/settings/settings-storage';
import { ApiKeyForm } from './ApiKeyForm';
import { RequestTemplateForm } from './RequestTemplateForm';

export function App() {
  const apiKey = useStoredSetting(apiKeySetting);
  const requestTemplate = useStoredSetting(requestTemplateSetting);

  return (
    <main className="options">
      <h1>Speedy Jev Settings</h1>
      {apiKey.value !== undefined && (
        <ApiKeyForm initialApiKey={apiKey.value} onSave={apiKey.save} />
      )}
      {requestTemplate.value !== undefined && (
        <RequestTemplateForm initialTemplate={requestTemplate.value} onSave={requestTemplate.save} />
      )}
    </main>
  );
}
