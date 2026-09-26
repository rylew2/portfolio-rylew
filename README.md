## Ryan Lewis Portfolio

## Features

- Styled with EmotionJS💅🏾
- Written in TypeScript ⚛
- Project and Book content types 🖊

## Mobile performance budget

Run a production build, then check the deterministic homepage JavaScript
budget:

```sh
npm run build
npm run performance:check
```

The check reads Next.js's production build manifest, including its
low-priority build metadata scripts, and caps initial homepage JavaScript at
185 KiB gzip across at most 13 requests, with no initial chunk larger than 65
KiB gzip. These limits protect mobile transfer and parse costs without using a
Lighthouse score as a flaky CI gate.

The chat launcher remains in the initial page, while its interactive
implementation downloads on first activation. Google Analytics remains loaded
asynchronously, Vercel Analytics remains enabled, and Prism's third-party theme
stylesheet remains in place; the budget detects future growth without removing
site telemetry or syntax highlighting.

## Production chatbot smoke check

The `Production Chat Smoke Check` GitHub Actions workflow sends a real visitor
question to `https://www.rylew.dev/api/chat`. It requires HTTP 200, valid JSON,
and a nonempty answer, with a 30-second timeout per attempt and one retry after
10 seconds. It uses the deployed app's model configuration and credentials;
no Groq API key or model name is stored in the workflow.

The workflow runs:

- Daily at 9:17 a.m. Eastern (`America/New_York`, including daylight saving time).
- After Vercel reports a successful `Production` deployment; previews are skipped.
- On demand from Actions > Production Chat Smoke Check > Run workflow.

Run it locally with Node 22 or newer (no dependency installation required):

```sh
npm run test:smoke:chat
```

Set `CHAT_SMOKE_URL` to a full API endpoint URL to check another environment.
The unit suite tests the command against a local HTTP server, so ordinary PR
unit tests do not call Groq.

For email alerts, enable GitHub Actions notifications and select failures only
in your GitHub notification settings. Scheduled-run notifications go to the
user who created or last edited the schedule (or re-enabled the workflow).
A failed run remains visible in the repository's Actions tab regardless of
email settings.

Standard GitHub-hosted runners are free for this public repository. Each live
check consumes Vercel/Groq quota: about 30 requests per month for the daily
schedule, plus deployments, manual runs, and retries. The check detects backend
availability failures; it does not assess answer quality or browser UI behavior.

GitHub schedules can be delayed or dropped under load. Public-repository
schedules are disabled after 60 days without repository activity and must be
re-enabled in Actions. See [GitHub scheduling documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
and [workflow notification documentation](https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs).
