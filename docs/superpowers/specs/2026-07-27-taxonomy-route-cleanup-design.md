# Taxonomy Route Cleanup Design

## Problem

The three dynamic taxonomy pages currently generate paths from every configured
tag or category. That creates empty book-tag, project-tag, and book-category
pages when a configured value is unused by that content type.

## Scope

Change static path generation for:

- `/books/tags/[tag]`
- `/projects/tags/[tag]`
- `/books/categories/[category]`

Do not change sitemap or robots behavior, metadata, content frontmatter,
homepage content, or page presentation.

## Design

Add a reusable content helper in `lib/content.ts` that returns the unique
taxonomy values present in a requested content type. It will support tag and
category values and derive them from the existing markdown-backed content list.

Each taxonomy page will keep its configuration file as the source of route
titles and descriptions, but filter that configuration against the values
returned by the content helper before producing static paths. This means:

- a configured route builds only when at least one item of that content type
  uses its taxonomy value;
- book and project tag paths remain independent;
- unused and unknown values are absent from `getStaticPaths`;
- `fallback: false` makes absent paths resolve as 404;
- retained routes continue to use their configured title and description.

Content values that lack configuration will not produce a route. Existing
coverage that requires all content tags to exist in `config/tags.json` remains
the guard for tag configuration completeness.

## Testing

Add focused unit coverage that calls the real `getStaticPaths` exports and
compares their parameters with literal taxonomy values derived independently
from the repository's current content. The test must fail against the existing
over-generation.

Add Playwright coverage that verifies a retained route renders content and
representative unused taxonomy URLs return 404. Run Playwright against an
isolated local server because `fallback: false` behavior is observable at the
HTTP boundary.

## Success Criteria

- Every generated taxonomy path has at least one matching item of its content
  type.
- No unused book tag, project tag, or book category path is generated.
- Representative unused taxonomy URLs return 404.
- Retained routes preserve configured titles and descriptions.
- Unit tests, build, formatting, and relevant/full Playwright coverage pass.
