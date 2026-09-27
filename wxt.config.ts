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
    permissions: ['activeTab', 'scripting', 'storage'],
    // The API key is only ever sent to this host.
    host_permissions: ['https://api.typesafe.ai/*'],
  },
});
