# Page-Specific Canonical and Social Metadata Design

## Goal

Every rendered page must publish one absolute canonical URL and a matching
`og:url` for its real route. Project and book detail pages must publish
`og:type=article`; every other page must publish `og:type=website`. Twitter
cards must reuse the page's existing title, description, and site-wide social
image values.

## Layout interface

`Layout` will require a `canonicalPath` prop and accept an optional
`ogType: "website" | "article"` prop that defaults to `"website"`.
`canonicalPath` will also replace the existing `pathname` prop for header
selection and page-change effects, so each caller provides one unambiguous,
route-specific path.

`Layout` will construct the absolute URL against the configured
`https://www.rylew.dev` origin. It will remove any search parameters or hash
before emitting metadata, ensuring tracked or anchored visits retain the same
canonical URL.

Static pages will pass literal paths. Dynamic pages will build concrete paths
from build-time content or route parameters:

- project detail: `/projects/${projectData.id}`
- book detail: `/books/${bookData.id}`
- project tag: `/projects/tags/${tag}`
- book tag: `/books/tags/${tag}`
- book category: `/books/categories/${category}`

Dynamic segments will be URL-encoded before interpolation. No caller will use
the Pages Router's `pathname`, because it represents route files such as
`/projects/[id]`, not the public URL. This follows the current official
Next.js Pages Router documentation.

## Emitted metadata

`Layout` will emit these values from its existing inputs and configuration:

- `<link rel="canonical">` and `og:url`: the sanitized absolute canonical URL
- `og:type`: the caller-supplied type, defaulting to `website`
- `twitter:card`: the existing `summary` value
- `twitter:title`: `pageTitle`
- `twitter:description`: `pageDescription` or the existing site description
- `twitter:image`: the same existing absolute image URL used by `og:image`

Existing document-title formatting, descriptions, keywords, Open Graph image,
site name, Twitter creator, favicon, visible content, and layout remain
unchanged.

## Verification

A focused Playwright suite will cover the homepage, all static page families,
at least one project detail, at least one book detail, and representative tag
and category routes. It will assert that canonical, `og:url`, `og:type`, and
each Twitter metadata tag occurs exactly once with the expected value. It will
also load a route with a query string and hash and assert that neither appears
in canonical metadata.

The final verification will use a production build and production Next.js
server on port 3106. Unit tests, changed-file formatting checks, the build, the
focused metadata suite, and the full Playwright suite must pass before the PR
is opened.

## Non-goals

This change will not alter positioning copy, keywords, the social image asset,
content, taxonomy, sitemap or robots behavior, README, homepage layout,
workflows, dependencies, security headers, or structured data.
