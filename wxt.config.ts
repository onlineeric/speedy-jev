import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  // Keep imports explicit so every dependency is visible in the source file.
  imports: false,
  manifest: {
    name: 'Speedy Jev',
    description:
      'Send web page text to Jev by TypeSafe AI and see typed answers instantly. Bring your own API key.',
    // `clipboardWrite` lets the popup copy the captured text after async work, which Firefox
    // otherwise blocks because the click that opened the popup is no longer "recent".
    permissions: ['activeTab', 'scripting', 'storage', 'clipboardWrite'],
    // The API key is only ever sent to this host.
    host_permissions: ['https://api.typesafe.ai/*'],
  },
});
