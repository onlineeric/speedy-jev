<p align="center">
  <img src="public/icon/128.png" alt="Speedy Jev icon" width="96" height="96">
</p>

<h1 align="center">Speedy Jev</h1>

<p align="center">
  <strong>Ask AI questions about any web page in one click.</strong><br>
  Select some text (or nothing at all), click the icon, and get clear, structured answers from
  <a href="https://docs.typesafe.ai">Jev by TypeSafe AI</a> in seconds.
</p>

<p align="center">
  Chrome · Edge · Firefox · Free · Bring your own API key
</p>

## Author

Built by **Eric Cheng** ([@onlineeric](https://github.com/onlineeric)), the author of
[**Speedy Git**](https://github.com/onlineeric/speedy-git-ext), a performance-first Git graph,
Git action tool and Git worktrees manager for VS Code, Cursor and other coding IDEs.

Speedy Jev follows the same idea: fast, lightweight and focused on getting you the answer
without getting in your way.

---

## Why Speedy Jev?

Most AI tools make you copy text, switch tabs, paste, type a prompt, and read a long reply.
Speedy Jev skips all of that.

- **One click, instant answers.** No chat window, no prompt typing. Click the toolbar icon and the
  answers are there.
- **Answers you can act on.** You get short, structured results like *"Positive · 82% confidence"*
  or *"Yes (91% yes)"*, not paragraphs of text.
- **Your questions, reused everywhere.** Set up the questions you care about once, then ask them
  about any article, email, review, product page or support ticket.
- **Selection or whole page.** Highlight a paragraph to ask about just that part, or select
  nothing to use the whole page.
- **Know what it costs.** Every result shows the token count and an estimated cost, so there are
  no surprises on your bill.
- **Private by design.** Your API key stays on your device. Nothing is read from a page until you
  click, and text is only sent to Jev.
- **Fast and lightweight.** A tiny popup with nothing running in the background, so it never
  slows down your browsing.

## What can you use it for?

Out of the box, Speedy Jev answers three example questions about any page:

| Question | Example answer |
| --- | --- |
| What is the overall sentiment of this text? | Positive · score 3.12 (88% confidence) |
| What kind of content is this? | opinion (93% confidence) |
| Does this text ask the reader to take a specific action? | No (12% yes) |

Swap them for your own questions to fit how you work, for example:

- **Research:** Is this source news, opinion or marketing? Does it cite evidence?
- **Customer support:** How urgent is this ticket? Is the customer angry? Is it a bug or a
  feature request?
- **Shopping:** Is this review genuine? Does this product page mention a warranty?
- **Recruiting:** Does this profile match the role? Which seniority level fits best?
- **Content moderation:** Is this comment spam? Does it break the community rules?
- **Email triage:** Does this email need a reply today?

Jev supports three kinds of questions, so you can ask almost anything:

- **Yes / no** questions, answered with a probability.
- **Multiple choice** questions, answered with the best option and a confidence.
- **Score** questions on your own scale (for example *Very negative* to *Very positive*).

## Get started in 2 minutes

1. **Install Speedy Jev** for your browser (see [Install](#install) below).
2. **Get a Jev API key** from [TypeSafe AI](https://docs.typesafe.ai).
3. **Add your key.** Click the Speedy Jev icon, then **Settings** (or right-click the icon →
   **Options**), and paste your key.
4. **Pin the icon** to your toolbar so it is always one click away.
5. **Try it.** Open any article, optionally select some text, and click the icon.

That's it. The first answers use the example questions, so you can see how it works right away.

## Install

<!-- TODO: Add Chrome Web Store, Edge Add-ons and Firefox Add-ons links once published. -->

Speedy Jev works in **Google Chrome**, **Microsoft Edge** and **Mozilla Firefox**.

Store listings are on the way. Until then, you can build and load it yourself by following the
steps in [DEVELOPMENT.md](DEVELOPMENT.md#load-the-extension-locally).

## Ask your own questions

Open **Settings** and edit the **request template**. It is a small JSON document where each entry
under `questions` is one question. Wherever you write `{{text}}`, Speedy Jev puts the text from the
page.

```json
{
  "model": "jev-latest",
  "state": "{{text}}",
  "questions": {
    "needs_reply_today": {
      "type": "noul",
      "instructions": "Does this email need a reply today?"
    },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is this request?",
      "criteria": ["Not urgent", "Low", "Medium", "High", "Critical"]
    },
    "category": {
      "type": "choice",
      "instructions": "What is this message about?",
      "criteria": {
        "billing": "Payments, invoices or refunds",
        "bug": "Something is broken",
        "feature": "A request for something new",
        "other": "Anything else"
      }
    }
  }
}
```

- `noul` is a yes / no question, `choice` is multiple choice, and `score` rates on your scale.
- `{{text}}` can go in any text value, as many times as you like, even inside a longer sentence
  like `"Title: {{text}}"`.
- Any page text is safe to use: quotes, line breaks and special characters never break your
  template.
- See the [Jev API reference](https://docs.typesafe.ai/api) for every option.

## Other settings

- **Clipboard:** Speedy Jev copies the captured text to your clipboard while it asks Jev, so you
  can paste it elsewhere. Turn this off if you don't want it.
- **Input price:** used for the cost estimate. It defaults to Jev 1.13's price of $0.042 per
  million input tokens (output tokens are free). Update it if
  [the price](https://docs.typesafe.ai/models) changes.

Each result also shows the model used, the text that was sent, and the raw response if you want
the details.

## Your privacy and security

- **Your API key stays on your device.** It is saved in the browser's local extension storage.
  Only Speedy Jev can read it, and it is never synced to your browser account.
- **Your key only goes to Jev.** It is sent only to `https://api.typesafe.ai`. This address is
  built in and cannot be changed, and the extension has no permission to talk to any other site.
- **Pages are read only when you click.** Speedy Jev does not run on the pages you visit and
  cannot see your browsing. It reads the current tab only at the moment you click its icon.
- **Answers are shown as plain text,** so a response can never run code in your browser.
- **No tracking, no analytics, no accounts.** Speedy Jev has no server of its own.

## Good to know

- You need your own Jev API key. Usage is billed by TypeSafe AI to your account.
- Only one request template can be active at a time.
- Text inside embedded frames (iframes) is not included.
- Text selected inside input boxes and text areas is not treated as a selection, so the whole page
  is used instead.
- Keep the popup open until the answers arrive. Closing it cancels the request.

## Feedback and contributing

Found a bug or have an idea? [Open an issue](https://github.com/onlineeric/speedy-jev/issues).
If you like Speedy Jev, a ⭐ on GitHub helps other people find it.

Want to build it yourself or contribute code? See [DEVELOPMENT.md](DEVELOPMENT.md).
