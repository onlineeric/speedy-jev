# Privacy Policy

**Speedy Jev** browser extension
Effective date: 29 September 2026

Speedy Jev lets you ask Jev, an AI API by TypeSafe AI, questions about the text on the current web
page. This policy explains what data the extension handles, where it goes, and what it never does.

## Summary

- Speedy Jev has **no server of its own**. The developer never receives, sees or stores your data.
- Page text is read **only when you click** the extension icon, and is sent **only to the Jev API**
  (`https://api.typesafe.ai`).
- Your API key and settings are stored **only on your device**.
- There is **no tracking, no analytics, no advertising and no account**.

## Data the extension handles

### 1. Web page text (website content)

When you click the Speedy Jev toolbar icon, the extension reads the text you selected on the current
tab, or the whole page's visible text if nothing is selected. That text is:

- inserted into your request template and sent to the Jev API at `https://api.typesafe.ai` to get
  answers to your questions;
- shown in the popup so you can see what was sent;
- optionally copied to your clipboard (you can turn this off in Settings).

The extension does not read any page until you click its icon, and does not run on the pages you
visit. Page text isn't stored by the extension after the popup closes.

### 2. Your Jev API key (authentication information)

You enter your own Jev API key in Settings. It is:

- saved in your browser's local extension storage on your device (never synced to your browser
  account);
- sent only to `https://api.typesafe.ai`, with each request, to authenticate you with Jev.

### 3. Settings

Your request template, the input token price used for cost estimates, and the clipboard setting are
saved in local extension storage on your device. They're never sent anywhere, except that the
request template (with the page text filled in) is sent to the Jev API as the request itself.

## Third parties

The only third party that receives data is **TypeSafe AI**, the provider of the Jev API, and only
when you click the extension icon. TypeSafe AI's handling of the data you send is covered by their
own terms and privacy policy (see [typesafe.ai](https://typesafe.ai) and
[docs.typesafe.ai](https://docs.typesafe.ai)). Usage of the Jev API is billed by TypeSafe AI to your
account.

The Jev API address is built into the extension and can't be changed, and the extension has no
permission to contact any other website.

## What Speedy Jev does not do

- It doesn't sell, rent or share your data with anyone.
- It doesn't collect browsing history or track your activity.
- It doesn't use analytics, advertising or tracking tools.
- It doesn't use your data for any purpose other than answering the questions you ask.
- It doesn't use your data to determine creditworthiness or for lending purposes.

Speedy Jev's use of data complies with the
[Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq),
including the Limited Use requirements.

## Deleting your data

All data stored by Speedy Jev lives in your browser. You can clear your API key and settings in the
extension's Settings page, or remove everything by uninstalling the extension.

## Changes to this policy

If this policy changes, the updated version will be published in this file with a new effective
date. You can see its full history in the
[GitHub repository](https://github.com/onlineeric/speedy-jev/commits/main/PRIVACY.md).

## Contact

Questions or concerns? Open an issue at
[github.com/onlineeric/speedy-jev/issues](https://github.com/onlineeric/speedy-jev/issues).
