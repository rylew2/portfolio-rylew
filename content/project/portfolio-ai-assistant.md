---
title: 'Portfolio AI Assistant'
date: '2026-07'
slug: 'portfolio-ai-assistant'
selectedWork: true
description: 'A grounded AI assistant for exploring my portfolio, experience, and projects.'
previewImage: '/images/project/portfolio-ai-assistant/chat-widget-open.png'
previewImageAlt: 'Portfolio homepage with the AI assistant chat panel open'
previewImageWidth: 1200
previewImageHeight: 600
sourceCode: 'https://github.com/rylew2/portfolio-rylew'
tags:
  - react
  - javascript
  - fullstack
---

## Overview

This portfolio includes a floating chat widget that lets a visitor ask about my
background, skills, projects, and book notes without leaving the page. The React
widget sends the current message and conversation history to the site's
`/api/chat` route, where the server builds a prompt grounded in the same
information the portfolio displays.

## Generated portfolio context

The assistant's context comes from two generated sources. `me/profile.json` is
the source for biographical information and is converted into
`me/summary.txt`. The Markdown files behind the project and book pages are
condensed into `me/chat-context.json`. Both generators run before a production
build, so the assistant receives profile and content context maintained in the
repository instead of a separate hand-written knowledge base.

The content generator removes code blocks, image references, and HTML before it
writes each item's title, slug, date, description, tags, and condensed body to
the context file.

## Keyword-scored retrieval

Before asking the model for a response, the API uses a small retrieval step to
choose detailed project and book context. It lowercases and tokenizes the
visitor's query, then scores matches in an item's title, tags, description, and
body. Title matches receive the greatest weight, followed by tags,
descriptions, and body content.

For a general query, up to three highest-scoring projects and up to three
highest-scoring books are included as detailed context. A direct title or slug
mention selects that item, while list-style requests such as "all projects"
include the full matching collection. Every project and book still appears in
the shorter summary section of the prompt.

## Groq chat completion

The server sends an OpenAI-style chat-completions request to Groq's
OpenAI-compatible endpoint. The request includes the generated system prompt,
sanitized conversation history, and current visitor message. The API key stays
on the server; the browser communicates only with the portfolio's internal
route.

## API protections

The merged API hardening keeps the public endpoint intentionally narrow:

- Only `POST` is accepted.
- Messages and history are trimmed, bounded, and rejected when malformed.
- History accepts only `user` and `assistant` roles, preventing a visitor from
  injecting a system-role message.
- A per-client rolling rate limit allows ten attempts in sixty seconds, with
  periodic cleanup and a cap on stored client buckets.
- Groq requests use a ten-second timeout.
- Upstream failures and missing configuration return generic visitor-facing
  errors, and malformed or empty model responses are rejected.
- The system prompt explicitly treats visitor messages and history as
  untrusted data that cannot override its instructions.

## Test coverage

The Node test suites exercise request boundaries, role validation, aggregate
history limits, rolling-window behavior, client identification, sanitized
prompt construction, timeout handling, upstream failures, and response
validation. Playwright checks the site's rendered content and accessibility,
including the chat panel in both themes. Focused browser tests also verify that
this case-study route is generated and that its screenshot card appears on both
the Projects page and homepage.
