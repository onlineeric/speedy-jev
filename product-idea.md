# Speedy Jev product idea

I am the author of Speedy Git - a VSCode Extension. Now I want to create a web browser extension called Speedy Jev.

## Product high-level idea
I want to create a web browser extension that:
- when click on the extension, it reads the content of the current web page text, or the selected text.
- it will then post the text to Jev by TypeSafe AI, the System One model, and display the response.
- this is a Bring Your Own Key (BYOK) extension, meaning users will provide their own API key for Jev by TypeSafe AI.
- our extension will store the key in the browser's local storage securely, the extension will keep the key safe, never send it or expose it anywhere.
- this repo will be a single source of the browser extension, we target to publish to Chrome web store, Edge web store, and Firefox add-ons.
- same as Speedy Git, we will focus on providing a performance first, seamless and efficient user experience. The extension must be fast, lightweight, and developer friendly.

## first version features

This is a first version features idea:

- the extension should have a configuration feature, allow user to setup and store the pre-defined Request Body json template.
- the captured text from the web page should be inserted into the pre-defined Request Body json template before sending it to Jev.
- just display the response from Jev in the extension's popup.

